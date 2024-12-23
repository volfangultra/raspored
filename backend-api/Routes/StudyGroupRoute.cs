// <copyright file="StudyGroupRoutes.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class StudyGroupRoutes
{
    public static void MapStudyGroupRoutes(this WebApplication app)
    {
        app.MapGet("/studygroups", async (AppDbContext db) => await db.StudyGroups.ToListAsync());

        app.MapGet("/studygroups/count", async (AppDbContext db) => await db.StudyGroups.CountAsync());

        app.MapGet("/studygroups/{id}", async (int id, AppDbContext db) => await db.StudyGroups.FindAsync(id) is StudyGroup studygroup
                ? Results.Ok(studygroup)
                : Results.NotFound());

        app.MapPost("/studygroups", async (StudyGroup studygroup, AppDbContext db) =>
        {
            db.StudyGroups.Add(studygroup);
            await db.SaveChangesAsync();
            return Results.Created($"/studygroups/{studygroup.Id}", studygroup);
        });
    }
}
