// <copyright file="ProfessorRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ProfessorRoutes
{
    public static void MapProfessorRoutes(this WebApplication app)
    {
        app.MapGet("/professors", async (AppDbContext db) => await db.Professors.ToListAsync());

        app.MapGet("/professors/{id}", async (int id, AppDbContext db) => await db.Professors.FindAsync(id) is Professor professor
                ? Results.Ok(professor)
                : Results.NotFound());

        app.MapPost("/professors", async (Professor professor, AppDbContext db) =>
        {
            db.Professors.Add(professor);
            await db.SaveChangesAsync();
            return Results.Created($"/professors/{professor.Id}", professor);
        });

        app.MapPut("/professors/{id}", async (int id, Professor updatedProfessor, AppDbContext db) =>
        {
            var professor = await db.Professors.FindAsync(id);
            if (professor is null)
            {
                return Results.NotFound();
            }

            professor.Name = updatedProfessor.Name;
            professor.Rank = updatedProfessor.Rank;

            db.Professors.Update(professor);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapDelete("/professors/{id}", async (int id, AppDbContext db) =>
        {
            var professor = await db.Professors.FindAsync(id);
            if (professor is null)
            {
                return Results.NotFound();
            }

            db.Professors.Remove(professor);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
