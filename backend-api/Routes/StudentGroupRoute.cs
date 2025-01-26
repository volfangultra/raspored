namespace ProjectNamespace.Routes;

using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class StudentGroupRoutes
{
    public class GroupTakesCoursesDto
    {
        public int CourseId { get; set; }

        public int StudentGroupId { get; set; }
    }

    public class StudentGroupDto
    {
        public int Id { get; set; }

        public int ScheduleId { get; set; }

        public string Major { get; set; }

        public int Year { get; set; }

        public string Name { get; set; }

        public ICollection<GroupTakesCoursesDto> GroupTakesCourses { get; set; }
    }

    public static void MapStudentGroupRoutes(this WebApplication app)
    {
        app.MapGet("/student-groups", async (AppDbContext db, int scheduleId) =>
        {
            var studentGroups = await db.StudentGroups
                .Where(group => group.ScheduleId == scheduleId)
                .Select(group => new StudentGroupDto
                {
                    Id = group.Id,
                    ScheduleId = group.ScheduleId,
                    Major = group.Major,
                    Year = group.Year,
                    Name = group.Name,
                    GroupTakesCourses = group.GroupTakesCourses.Select(cc => new GroupTakesCoursesDto
                    {
                        CourseId = cc.CourseId,
                        StudentGroupId = cc.StudentGroupId,
                    }).ToList(),
                })
                .ToListAsync();

            return Results.Ok(studentGroups);
        });

        app.MapGet("/student-groups/{id}", async (int id, AppDbContext db) =>
        {
            var studentGroup = await db.StudentGroups
                .Where(group => group.Id == id)
                .Select(group => new StudentGroupDto
                {
                    Id = group.Id,
                    ScheduleId = group.ScheduleId,
                    Major = group.Major,
                    Year = group.Year,
                    Name = group.Name,
                    GroupTakesCourses = group.GroupTakesCourses.Select(cc => new GroupTakesCoursesDto
                    {
                        CourseId = cc.CourseId,
                        StudentGroupId = cc.StudentGroupId,
                    }).ToList(),
                })
                .FirstOrDefaultAsync();

            return studentGroup is not null ? Results.Ok(studentGroup) : Results.NotFound();
        });

        app.MapPost("/student-groups", async (StudentGroupDto groupDto, AppDbContext db) =>
        {
            var studentGroup = new StudentGroup
            {
                ScheduleId = groupDto.ScheduleId,
                Major = groupDto.Major,
                Year = groupDto.Year,
                Name = groupDto.Name,
                GroupTakesCourses = groupDto.GroupTakesCourses.Select(cc => new GroupTakesCourses
                {
                    CourseId = cc.CourseId,
                    StudentGroupId = cc.StudentGroupId,
                }).ToList(),
            };

            db.StudentGroups.Add(studentGroup);
            await db.SaveChangesAsync();
            return Results.Created($"/student-groups/{studentGroup.Id}", groupDto);
        });

        app.MapPut("/student-groups/{id}", async (int id, StudentGroupDto updatedGroupDto, AppDbContext db) =>
        {
            var studentGroup = await db.StudentGroups
                .Include(g => g.GroupTakesCourses)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (studentGroup is null)
            {
                return Results.NotFound();
            }

            studentGroup.ScheduleId = updatedGroupDto.ScheduleId;
            studentGroup.Major = updatedGroupDto.Major;
            studentGroup.Year = updatedGroupDto.Year;
            studentGroup.Name = updatedGroupDto.Name;

            if (updatedGroupDto.GroupTakesCourses != null)
            {
                db.GroupTakesCourses.RemoveRange(studentGroup.GroupTakesCourses);

                studentGroup.GroupTakesCourses = updatedGroupDto.GroupTakesCourses.Select(cc => new GroupTakesCourses
                {
                    CourseId = cc.CourseId,
                    StudentGroupId = cc.StudentGroupId,
                }).ToList();
            }

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapDelete("/student-groups/{id}", async (int id, AppDbContext db) =>
        {
            // Find the student group by its ID and include related entities
            var studentGroup = await db.StudentGroups
                .Include(g => g.GroupTakesCourses)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (studentGroup is null)
            {
                return Results.NotFound();
            }

            // Check if GroupTakesCourses is not null and remove entries
            if (studentGroup.GroupTakesCourses is not null && studentGroup.GroupTakesCourses.Any())
            {
                db.GroupTakesCourses.RemoveRange(studentGroup.GroupTakesCourses);
            }

            // Remove the student group itself
            db.StudentGroups.Remove(studentGroup);

            // Save changes to the database
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

    }
}
