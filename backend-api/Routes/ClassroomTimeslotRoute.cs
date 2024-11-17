// <copyright file="ClassroomTimeslotRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ClassroomTimeslotRoutes
{
    public static void MapClassroomTimeslotRoutes(this WebApplication app)
    {
        app.MapGet("/classroomtimeslots", async (AppDbContext db) => await db.ClassroomTimeslots.ToListAsync());

        app.MapGet("/classroomtimeslots/{id}", async (int id, AppDbContext db) => await db.ClassroomTimeslots.FindAsync(id) is ClassroomTimeslot classroomtimeslot
                ? Results.Ok(classroomtimeslot)
                : Results.NotFound());

        app.MapPost("/classroomtimeslots", async (ClassroomTimeslot classroomtimeslot, AppDbContext db) =>
        {
            db.ClassroomTimeslots.Add(classroomtimeslot);
            await db.SaveChangesAsync();
            return Results.Created($"/classroomtimeslots/{classroomtimeslot.Id}", classroomtimeslot);
        });
    }
}
