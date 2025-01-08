// <copyright file="ProfessorRoute.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ProfessorRoutes
{
    public class ProfessorAvailabilityDTO
    {
        public int Day { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }
    }

    public class ProfessorDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int ScheduleId { get; set; }

        public string Rank { get; set; }

        public ICollection<ProfessorAvailabilityDTO> ProfessorAvailabilities { get; set; }
    }

    public static void MapProfessorRoutes(this WebApplication app)
    {
        app.MapGet("/professors", async (AppDbContext db, int scheduleId) =>
        {
            var professors = await db.Professors
                .Where(p => p.ScheduleId == scheduleId)
                .Select(p => new ProfessorDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    ScheduleId = p.ScheduleId,
                    Rank = p.Rank,
                    ProfessorAvailabilities = p.ProfessorAvailabilities.Select(pa => new ProfessorAvailabilityDTO
                    {
                        Day = pa.Day,
                        StartTime = pa.StartTime,
                        EndTime = pa.EndTime,
                    }).ToList(),
                })
                .ToListAsync();

            return Results.Ok(professors);
        });


        app.MapGet("/professors/{id}", async (int id, AppDbContext db) =>
        {
            var professor = await db.Professors
                .Where(p => p.Id == id)
                .Select(p => new ProfessorDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    ScheduleId = p.ScheduleId,
                    Rank = p.Rank,
                    ProfessorAvailabilities = p.ProfessorAvailabilities.Select(pa => new ProfessorAvailabilityDTO
                    {
                        Day = pa.Day,
                        StartTime = pa.StartTime,
                        EndTime = pa.EndTime,
                    }).ToList(),
                })
                .FirstOrDefaultAsync();

            return professor is not null ? Results.Ok(professor) : Results.NotFound();
        });

        app.MapPost("/professors", async (Professor professor, AppDbContext db) =>
        {
            db.Professors.Add(professor);
            await db.SaveChangesAsync();

            return Results.Created($"/professors", professor);
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
            professor.ScheduleId = updatedProfessor.ScheduleId;

            db.Professors.Update(professor);
            await db.SaveChangesAsync();

            if (updatedProfessor.ProfessorAvailabilities != null)
            {
                var existingAvailabilities = await db.ProfessorAvailabilities.Where(pa => pa.ProfessorId == id).ToListAsync();
                db.ProfessorAvailabilities.RemoveRange(existingAvailabilities);

                foreach (var availability in updatedProfessor.ProfessorAvailabilities)
                {
                    availability.ProfessorId = id;
                    db.ProfessorAvailabilities.Add(availability);
                }

                await db.SaveChangesAsync();
            }

            return Results.NoContent();
        });

        app.MapDelete("/professors/{id}", async (int id, AppDbContext db) =>
        {
            var professor = await db.Professors
                .Include(p => p.ProfessorAvailabilities)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (professor is null)
            {
                return Results.NotFound();
            }

            var professorAvailabilities = db.ProfessorAvailabilities.Where(pa => pa.ProfessorId == id);
            db.ProfessorAvailabilities.RemoveRange(professorAvailabilities);

            db.Professors.Remove(professor);

            await db.SaveChangesAsync();

            return Results.NoContent();
        });


        app.MapPost("/professors/{professorId}/availabilities", async (int professorId, ProfessorAvailability availability, AppDbContext db) =>
        {
            var professor = await db.Professors.FindAsync(professorId);
            if (professor is null)
            {
                return Results.NotFound();
            }

            availability.ProfessorId = professorId;
            db.ProfessorAvailabilities.Add(availability);
            await db.SaveChangesAsync();

            return Results.Created($"/professors/{professorId}/availabilities/{availability.Id}", availability);
        });

        app.MapPut("/professors/{professorId}/availabilities/{availabilityId}", async (int professorId, int availabilityId, ProfessorAvailability updatedAvailability, AppDbContext db) =>
        {
            var availability = await db.ProfessorAvailabilities.FindAsync(availabilityId);
            if (availability is null || availability.ProfessorId != professorId)
            {
                return Results.NotFound();
            }

            availability.Day = updatedAvailability.Day;
            availability.StartTime = updatedAvailability.StartTime;
            availability.EndTime = updatedAvailability.EndTime;

            db.ProfessorAvailabilities.Update(availability);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });

        app.MapDelete("/professors/{professorId}/availabilities/{availabilityId}", async (int professorId, int availabilityId, AppDbContext db) =>
        {
            var availability = await db.ProfessorAvailabilities.FindAsync(availabilityId);
            if (availability is null || availability.ProfessorId != professorId)
            {
                return Results.NotFound();
            }

            db.ProfessorAvailabilities.Remove(availability);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}
