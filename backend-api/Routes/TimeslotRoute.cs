// <copyright file="TimeslotRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;
/*
public static class TimeslotRoutes
{
    public static void MapTimeslotRoutes(this WebApplication app)
    {
        app.MapGet("/timeslots", async (AppDbContext db) => await db.Timeslots.ToListAsync());

        app.MapGet("/timeslots/{id}", async (int id, AppDbContext db) => await db.Timeslots.FindAsync(id) is Timeslot timeslot
                ? Results.Ok(timeslot)
                : Results.NotFound());

        app.MapPost("/timeslots", async (Timeslot timeslot, AppDbContext db) =>
        {
            db.Timeslots.Add(timeslot);
            await db.SaveChangesAsync();
            return Results.Created($"/timeslots/{timeslot.Id}", timeslot);
        });
    }
}
*/