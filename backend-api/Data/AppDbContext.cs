// <copyright file="AppDbContext.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Data;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options): DbContext(options)
{
    public DbSet<Student> Students { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Professor> Professors {get; set; }
    public DbSet<StudyGroup> StudyGroups {get; set; }
    public DbSet<Classroom> Classrooms {get; set; }
    public DbSet<Timeslot> Timeslots {get; set; }
    public DbSet<ProfessorTimeslot> ProfessorTimeslots {get; set; }
    public DbSet<ClassroomTimeslot> ClassroomTimeslots {get; set; }
    public DbSet<Lesson> Lessons {get; set; }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "raspored.db");
        options.UseSqlite($"Data Source={dbPath}");
    }

}
