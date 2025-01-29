namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

public static class UserRoutes
{
    public static void MapUserRoutes(this WebApplication app)
    {
        var allowedOrigin = app.Configuration["REACT_APP_URL"];
        var validIssuer = app.Configuration["REACT_APP_API_URL"];
        var secretKey = app.Configuration["SECRET_KEY"];

        app.MapGet("/users", [Authorize(Roles = "admin")] async (AppDbContext db) => await db.Users.ToListAsync());

        app.MapDelete("/delete-user/{id:int}", [Authorize(Roles = "admin")] async (AppDbContext db, int id) =>
        {
            var user = await db.Users
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.Courses)
                        .ThenInclude(c => c.CourseCanNotUseClassrooms)
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.Courses)
                        .ThenInclude(c => c.GroupTakesCourses)
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.Courses)
                        .ThenInclude(c => c.Lessons)
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.Professors)
                        .ThenInclude(p => p.ProfessorUnavailabilities)
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.Classrooms)
                .Include(u => u.Schedules)
                    .ThenInclude(s => s.StudentGroups)
                        .ThenInclude(g => g.GroupTakesCourses)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return Results.NotFound(new { Message = "User not found." });
            }

            try
            {
                // Remove all schedules and their related data
                if (user.Schedules != null)
                {
                    foreach (var schedule in user.Schedules)
                    {
                        if (schedule.Courses != null)
                        {
                            foreach (var course in schedule.Courses)
                            {
                                if (course.CourseCanNotUseClassrooms != null)
                                    db.CourseCanNotUseClassrooms.RemoveRange(course.CourseCanNotUseClassrooms);

                                if (course.GroupTakesCourses != null)
                                    db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);

                                if (course.Lessons != null)
                                    db.Lessons.RemoveRange(course.Lessons);
                            }
                            db.Courses.RemoveRange(schedule.Courses);
                        }

                        if (schedule.Professors != null)
                        {
                            foreach (var professor in schedule.Professors)
                            {
                                if (professor.ProfessorUnavailabilities != null)
                                    db.ProfessorUnavailabilities.RemoveRange(professor.ProfessorUnavailabilities);
                            }
                            db.Professors.RemoveRange(schedule.Professors);
                        }

                        if (schedule.Classrooms != null)
                        {
                            db.Classrooms.RemoveRange(schedule.Classrooms);
                        }

                        if (schedule.StudentGroups != null)
                        {
                            foreach (var group in schedule.StudentGroups)
                            {
                                if (group.GroupTakesCourses != null)
                                    db.GroupTakesCourses.RemoveRange(group.GroupTakesCourses);
                            }
                            db.StudentGroups.RemoveRange(schedule.StudentGroups);
                        }

                        db.Schedules.Remove(schedule);
                    }
                }

                // Remove the user itself
                db.Users.Remove(user);

                await db.SaveChangesAsync();
                return Results.Ok(new { Message = "User and associated schedules successfully deleted." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting user: {ex.Message}");
                return Results.Problem("An error occurred while deleting the user and their schedules.");
            }
        });

        app.MapGet("/users/count", [Authorize(Roles = "admin")] async (AppDbContext db) => await db.Users.CountAsync());

        app.MapPost("/add-user", [Authorize(Roles = "admin")] async (AppDbContext db, HttpContext context) =>
        {
            var userData = await context.Request.ReadFromJsonAsync<User>();

            if (string.IsNullOrWhiteSpace(userData?.Username) || string.IsNullOrWhiteSpace(userData?.PasswordHash))
            {
                return Results.BadRequest(new { Message = "Username and password are required." });
            }

            if (await db.Users.AnyAsync(u => u.Username == userData.Username))
            {
                return Results.Conflict(new { Message = "Username already exists." });
            }
            if (string.IsNullOrWhiteSpace(userData?.PasswordHash))
            {
                return Results.BadRequest(new { Message = "Password is required." });
            }

            userData.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userData.PasswordHash);

            try
            {
                db.Users.Add(userData);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database Error: {ex.Message}");
                return Results.Problem("An error occurred while saving the user.");
            }

            return Results.Ok(new { Message = "User successfully added." });
        });

        app.MapPost("/login", async (AppDbContext db, HttpContext context) =>
        {
            var loginData = await context.Request.ReadFromJsonAsync<User>();
            //Uncomment this and user will be added as you login
            // var sql = "INSERT INTO Users (Username, Email, PasswordHash, College, Role) VALUES ({0}, {1}, {2}, {3}, {4})";
            // db.Database.ExecuteSqlRaw(sql, loginData.Username, "emin.mulaimovic2305@gmail.com",
            // BCrypt.Net.BCrypt.HashPassword(loginData.PasswordHash), "PMF", "user");

            var user = await db.Users.FirstOrDefaultAsync(u => u.Username == loginData.Username);

            if (user == null)
            {
                return Results.NotFound(new { Message = "User not found." });
            }

            if (!BCrypt.Net.BCrypt.Verify(loginData.PasswordHash, user.PasswordHash))
            {
                return Results.BadRequest(new { Message = "Incorrect password." });
            }
            var token = GenerateJwtToken(user, validIssuer, allowedOrigin, secretKey);
            return Results.Ok(new { Token = token, Role = user.Role, Id = user.Id });
        });

        app.MapGet("/admin-data", [Authorize(Roles = "admin")] async () =>
        {
            return Results.Ok(new { Message = "This is admin-only data!" });
        });

        app.MapGet("/user-data", [Authorize(Roles = "user")] async () =>
        {
            return Results.Ok(new { Message = "This is user-only data!" });
        });
    }

    private static string GenerateJwtToken(User user, string validIssuer, string allowedOrigin, string secretKey)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: validIssuer,
            audience: allowedOrigin,
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
