namespace ProjectNamespace.Routes;

using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;
using Microsoft.AspNetCore.Authorization;

public static class CourseRoutes
{
    public class LessonDto
    {
        public int Id { get; set; }
        public int ClassroomId { get; set; }

        public int Day { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

    }
    public class CourseCanNotUseClassroomDto
    {
        public int CourseId { get; set; }

        public int ClassroomId { get; set; }
    }

    public class GroupTakesCoursesDto
    {
        public int CourseId { get; set; }

        public int StudentGroupId { get; set; }
    }

    public class CourseDto
    {
        public int Id { get; set; }

        public int ScheduleId { get; set; }

        public int ProfessorId { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public int LectureSlotLength { get; set; }

        public ICollection<CourseCanNotUseClassroomDto> CourseCanNotUseClassrooms { get; set; }

        public ICollection<GroupTakesCoursesDto> GroupTakesCourses { get; set; }
        public ICollection<LessonDto> Lessons { get; set; }
    }

    public static void MapCourseRoutes(this WebApplication app)
    {
        app.MapGet("/courses", async (AppDbContext db, int scheduleId) =>
        {
            var courses = await db.Courses
                .Where(c => c.ScheduleId == scheduleId)
                .Include(c => c.CourseCanNotUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    ScheduleId = c.ScheduleId,
                    ProfessorId = c.ProfessorId,
                    Name = c.Name,
                    Type = c.Type,
                    LectureSlotLength = c.LectureSlotLength,
                    CourseCanNotUseClassrooms = c.CourseCanNotUseClassrooms.Select(cc => new CourseCanNotUseClassroomDto
                    {
                        CourseId = cc.CourseId,
                        ClassroomId = cc.ClassroomId,
                    }).ToList(),
                    GroupTakesCourses = c.GroupTakesCourses.Select(gt => new GroupTakesCoursesDto
                    {
                        CourseId = gt.CourseId,
                        StudentGroupId = gt.StudentGroupId,
                    }).ToList(),
                    Lessons = c.Lessons.Select(ls => new LessonDto{
                        Id = ls.Id,
                        ClassroomId = ls.ClassroomId,
                        Day = ls.Day,
                        StartTime = ls.StartTime,
                        EndTime = ls.EndTime,
                    }).ToList(),
                }).ToListAsync();

            return Results.Ok(courses);
        });

        app.MapGet("/courses/{id}", async (int id, AppDbContext db) =>
        {
            var course = await db.Courses
                .Where(c => c.Id == id)
                .Include(c => c.CourseCanNotUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    ScheduleId = c.ScheduleId,
                    ProfessorId = c.ProfessorId,
                    Name = c.Name,
                    Type = c.Type,
                    LectureSlotLength = c.LectureSlotLength,
                    CourseCanNotUseClassrooms = c.CourseCanNotUseClassrooms.Select(cc => new CourseCanNotUseClassroomDto
                    {
                        CourseId = cc.CourseId,
                        ClassroomId = cc.ClassroomId,
                    }).ToList(),
                    GroupTakesCourses = c.GroupTakesCourses.Select(gt => new GroupTakesCoursesDto
                    {
                        CourseId = gt.CourseId,
                        StudentGroupId = gt.StudentGroupId,
                    }).ToList(),
                }).FirstOrDefaultAsync();

            return course is not null ? Results.Ok(course) : Results.NotFound();
        });

        app.MapPost("/courses", async (CourseDto courseDto, AppDbContext db) =>
        {
            var course = new Course
            {
                ScheduleId = courseDto.ScheduleId,
                ProfessorId = courseDto.ProfessorId,
                Name = courseDto.Name,
                Type = courseDto.Type,
                LectureSlotLength = courseDto.LectureSlotLength,
                CourseCanNotUseClassrooms = courseDto.CourseCanNotUseClassrooms.Select(cc => new CourseCanNotUseClassroom
                {
                    CourseId = cc.CourseId,
                    ClassroomId = cc.ClassroomId,
                }).ToList(),
                GroupTakesCourses = courseDto.GroupTakesCourses.Select(gt => new GroupTakesCourses
                {
                    CourseId = gt.CourseId,
                    StudentGroupId = gt.StudentGroupId,
                }).ToList(),
            };

            db.Courses.Add(course);
            await db.SaveChangesAsync();
            return Results.Created($"/courses/{course.Id}", courseDto);
        });

        app.MapPut("/courses/{id}", async (int id, CourseDto updatedCourseDto, AppDbContext db) =>
        {
            var course = await db.Courses
                .Include(c => c.CourseCanNotUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course is null)
            {
                return Results.NotFound();
            }

            course.ScheduleId = updatedCourseDto.ScheduleId;
            course.ProfessorId = updatedCourseDto.ProfessorId;
            course.Name = updatedCourseDto.Name;
            course.Type = updatedCourseDto.Type;
            course.LectureSlotLength = updatedCourseDto.LectureSlotLength;

            db.CourseCanNotUseClassrooms.RemoveRange(course.CourseCanNotUseClassrooms);
            db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);

            course.CourseCanNotUseClassrooms = updatedCourseDto.CourseCanNotUseClassrooms.Select(cc => new CourseCanNotUseClassroom
            {
                CourseId = cc.CourseId,
                ClassroomId = cc.ClassroomId,
            }).ToList();

            course.GroupTakesCourses = updatedCourseDto.GroupTakesCourses.Select(gt => new GroupTakesCourses
            {
                CourseId = gt.CourseId,
                StudentGroupId = gt.StudentGroupId,
            }).ToList();

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapDelete("/courses/{id}", async (int id, AppDbContext db) =>
        {
            // Find the course by its ID and include related entities
            var course = await db.Courses
                .Include(c => c.CourseCanNotUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course is null)
            {
                return Results.NotFound();
            }

            // Check if CourseCanNotUseClassrooms is not null and remove entries
            if (course.CourseCanNotUseClassrooms is not null && course.CourseCanNotUseClassrooms.Any())
            {
                db.CourseCanNotUseClassrooms.RemoveRange(course.CourseCanNotUseClassrooms);
            }

            // Check if GroupTakesCourses is not null and remove entries
            if (course.GroupTakesCourses is not null && course.GroupTakesCourses.Any())
            {
                db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);
            }

            // Remove the course itself
            db.Courses.Remove(course);

            // Save changes to the database
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
