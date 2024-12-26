// <copyright file="ClassroomRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ClassroomRoutes
{
    public static void MapClassroomRoutes(this WebApplication app)
    {
        app.MapGet("/classrooms", async (AppDbContext db) => await db.Classrooms.ToListAsync());

        app.MapGet("/classrooms/{id}", async (int id, AppDbContext db) => await db.Classrooms.FindAsync(id) is Classroom classroom
                ? Results.Ok(classroom)
                : Results.NotFound());

        app.MapPost("/classrooms", async (Classroom classroom, AppDbContext db) =>
        {
            db.Classrooms.Add(classroom);
            await db.SaveChangesAsync();
            return Results.Created($"/classrooms/{classroom.Id}", classroom);
        });

        app.MapPut("/classrooms/{id}", async (int id, Classroom updatedClassroom, AppDbContext db) =>
        {
            var classroom = await db.Classrooms.FindAsync(id);
            if (classroom is null)
            {
                return Results.NotFound();
            }

            classroom.Name = updatedClassroom.Name;

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

            db.Classrooms.Remove(classroom);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
