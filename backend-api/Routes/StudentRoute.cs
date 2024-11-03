using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

namespace ProjectNamespace.Routes
{
    public static class StudentRoutes
    {
        public static void MapStudentRoutes(this WebApplication app)
        {
            app.MapGet("/students", async (AppDbContext db) =>
            {
                return await db.Students.ToListAsync();
            });

            app.MapGet("/students/{id}", async (int id, AppDbContext db) =>
            {
                return await db.Students.FindAsync(id) is Student student
                    ? Results.Ok(student)
                    : Results.NotFound();
            });

            app.MapPost("/students", async (Student student, AppDbContext db) =>
            {
                db.Students.Add(student);
                await db.SaveChangesAsync();
                return Results.Created($"/students/{student.id}", student);
            });
        }
    }
}
