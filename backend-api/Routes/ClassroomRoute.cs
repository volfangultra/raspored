namespace ProjectNamespace.Routes;

using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ClassroomRoutes
{
    public class ClassroomDTO
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public int Floor { get; set; }

        public int Capacity { get; set; }

        public int ScheduleId { get; set; }

        public ICollection<CourseCanUseClassroomDTO> CourseCanUseClassrooms { get; set; }

    }

    public class CourseCanUseClassroomDTO
    {
        public int CourseId { get; set; }

        public int ClassroomId { get; set; }
    }

    public static void MapClassroomRoutes(this WebApplication app)
    {
        app.MapGet("/classrooms", async (AppDbContext db, int scheduleId) =>
            await db.Classrooms
                .Where(p => p.ScheduleId == scheduleId)
                .Select(c => new ClassroomDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Floor = c.Floor,
                    Capacity = c.Capacity,
                    ScheduleId = c.ScheduleId,
                    CourseCanUseClassrooms = c.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroomDTO
                    {
                        CourseId = cc.CourseId,
                        ClassroomId = cc.ClassroomId,
                    }).ToList(),
                })
                .ToListAsync());

        app.MapGet("/classrooms/{id}", async (int id, AppDbContext db) =>
        {
            var classroom = await db.Classrooms
                .Where(c => c.Id == id)
                .Select(c => new ClassroomDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Floor = c.Floor,
                    Capacity = c.Capacity,
                    ScheduleId = c.ScheduleId,
                    CourseCanUseClassrooms = c.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroomDTO
                    {
                        CourseId = cc.CourseId,
                        ClassroomId = cc.ClassroomId,
                    }).ToList(),
                })
                .FirstOrDefaultAsync();

            return classroom is not null ? Results.Ok(classroom) : Results.NotFound();
        });

        app.MapPost("/classrooms", async (ClassroomDTO classroomDto, AppDbContext db) =>
        {
            var classroom = new Classroom
            {
                Name = classroomDto.Name,
                Floor = classroomDto.Floor,
                Capacity = classroomDto.Capacity,
                ScheduleId = classroomDto.ScheduleId,
                CourseCanUseClassrooms = classroomDto.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroom
                {
                    CourseId = cc.CourseId,
                    ClassroomId = cc.ClassroomId,
                }).ToList(),
            };

            db.Classrooms.Add(classroom);
            await db.SaveChangesAsync();

            return Results.Created($"/classrooms/{classroom.Id}", classroomDto);
        });

        app.MapPut("/classrooms/{id}", async (int id, ClassroomDTO classroomDto, AppDbContext db) =>
        {
            var classroom = await db.Classrooms
                .Include(g => g.CourseCanUseClassrooms)
                .FirstOrDefaultAsync(g => g.Id == id);
            if (classroom is null)
            {
                return Results.NotFound();
            }

            classroom.Name = classroomDto.Name;
            classroom.Floor = classroomDto.Floor;
            classroom.Capacity = classroomDto.Capacity;
            classroom.ScheduleId = classroomDto.ScheduleId;

            if (classroomDto.CourseCanUseClassrooms != null)
            {
                db.CourseCanUseClassrooms.RemoveRange(classroom.CourseCanUseClassrooms);

                classroom.CourseCanUseClassrooms = classroomDto.CourseCanUseClassrooms.Select(cc => new CourseCanUseClassroom
                {
                    CourseId = cc.CourseId,
                    ClassroomId = cc.ClassroomId,
                }).ToList();
            }

            db.Classrooms.Update(classroom);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapDelete("/classrooms/{id}", async (int id, AppDbContext db) =>
        {
            var classroom = await db.Classrooms.FindAsync(id);
            if (classroom is null)
            {
                return Results.NotFound();
            }

            var relatedEntries = db.CourseCanUseClassrooms.Where(c => c.ClassroomId == id);
            db.CourseCanUseClassrooms.RemoveRange(relatedEntries);

            db.Classrooms.Remove(classroom);

            await db.SaveChangesAsync();

            return Results.NoContent();
        });

    }
}
