// <copyright file="LessonRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

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
    }
}
