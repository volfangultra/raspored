// <copyright file="ProfessorTimeslotRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;
/*
public static class ProfessorTimeslotRoutes
{
    public static void MapProfessorTimeslotRoutes(this WebApplication app)
    {
        app.MapGet("/professortimeslots", async (AppDbContext db) => await db.ProfessorTimeslots.ToListAsync());

        app.MapGet("/professortimeslots/{id}", async (int id, AppDbContext db) => await db.ProfessorTimeslots.FindAsync(id) is ProfessorTimeslot professortimeslot
                ? Results.Ok(professortimeslot)
                : Results.NotFound());
    
        app.MapPost("/professortimeslots", async (ProfessorTimeslot professortimeslot, AppDbContext db) =>
        {
            db.ProfessorTimeslots.Add(professortimeslot);
            await db.SaveChangesAsync();
            return Results.Created($"/professortimeslots/{professortimeslot.Id}", professortimeslot);
        });
    }
}
*/