namespace ProjectNamespace.Routes;

using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class LessonRoutes
{
    public static void MapLessonRoutes(this WebApplication app)
    {
        app.MapGet("/lessons", async (AppDbContext db) => await db.Lessons.ToListAsync());

        app.MapGet("/lessons/{id}", async (int id, AppDbContext db) => await db.Lessons.FindAsync(id) is Lesson lesson
                ? Results.Ok(lesson)
                : Results.NotFound());

        app.MapPost("/lessons", async (Lesson lesson, AppDbContext db) =>
        {
            db.Lessons.Add(lesson);
            await db.SaveChangesAsync();
            return Results.Created($"/lessons/{lesson.Id}", lesson);
        });

        app.MapPut("/lessons/{id}", async (int id, Lesson updatedLesson, AppDbContext db) =>
        {
            var existingLesson = await db.Lessons.FindAsync(id);
            if (existingLesson is null)
                return Results.NotFound();

            existingLesson.CourseId = updatedLesson.CourseId;
            existingLesson.ClassroomId = updatedLesson.ClassroomId;
            existingLesson.Day = updatedLesson.Day;
            existingLesson.StartTime = updatedLesson.StartTime;
            existingLesson.EndTime = updatedLesson.EndTime;

            if (await db.Courses.FindAsync(updatedLesson.CourseId) == null)
                return Results.BadRequest($"Course with ID {updatedLesson.CourseId} does not exist.");

            if (await db.Classrooms.FindAsync(updatedLesson.ClassroomId) == null)
                return Results.BadRequest($"Classroom with ID {updatedLesson.ClassroomId} does not exist.");

            await db.SaveChangesAsync();
            return Results.NoContent();
        });


        app.MapDelete("/lessons/{id}", async (int id, AppDbContext db) =>
        {
            var lesson = await db.Lessons.FindAsync(id);
            if (lesson is null)
            {
                return Results.NotFound();
            }

            db.Lessons.Remove(lesson);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

    }
}
