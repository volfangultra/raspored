namespace ProjectNamespace.Routes;

using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class CourseRoutes
{
    public class CourseCanUseClassroomDto
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

        public ICollection<CourseCanUseClassroomDto> CourseCanUseClassrooms { get; set; }

        public ICollection<GroupTakesCoursesDto> GroupTakesCourses { get; set; }
    }

    public static void MapCourseRoutes(this WebApplication app)
    {
        app.MapGet("/courses", async (AppDbContext db, int scheduleId) =>
        {
            var courses = await db.Courses
                .Where(c => c.ScheduleId == scheduleId)
                .Include(c => c.CourseCanUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    ScheduleId = c.ScheduleId,
                    ProfessorId = c.ProfessorId,
                    Name = c.Name,
                    Type = c.Type,
                    LectureSlotLength = c.LectureSlotLength,
                    CourseCanUseClassrooms = c.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroomDto
                    {
                        CourseId = cc.CourseId,
                        ClassroomId = cc.ClassroomId,
                    }).ToList(),
                    GroupTakesCourses = c.GroupTakesCourses.Select(gt => new GroupTakesCoursesDto
                    {
                        CourseId = gt.CourseId,
                        StudentGroupId = gt.StudentGroupId,
                    }).ToList(),
                }).ToListAsync();

            return Results.Ok(courses);
        });

        app.MapGet("/courses/{id}", async (int id, AppDbContext db) =>
        {
            var course = await db.Courses
                .Where(c => c.Id == id)
                .Include(c => c.CourseCanUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    ScheduleId = c.ScheduleId,
                    ProfessorId = c.ProfessorId,
                    Name = c.Name,
                    Type = c.Type,
                    LectureSlotLength = c.LectureSlotLength,
                    CourseCanUseClassrooms = c.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroomDto
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
                CourseCanUseClassrooms = courseDto.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroom
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
                .Include(c => c.CourseCanUseClassrooms)
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

            db.CourseCanUseClassrooms.RemoveRange(course.CourseCanUseClassrooms);
            db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);

            course.CourseCanUseClassrooms = updatedCourseDto.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroom
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
            var course = await db.Courses
                .Include(c => c.CourseCanUseClassrooms)
                .Include(c => c.GroupTakesCourses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course is null)
            {
                return Results.NotFound();
            }

            db.CourseCanUseClassrooms.RemoveRange(course.CourseCanUseClassrooms);
            db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);
            db.Courses.Remove(course);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
