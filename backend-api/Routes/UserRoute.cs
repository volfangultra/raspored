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
            return Results.Ok(new { Token = token, Role = user.Role });
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
