// <copyright file="AppDbContext.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Data;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options): DbContext(options)
{
    public DbSet<Classroom> Classrooms { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Professor> Professors {get; set; }
    public DbSet<Course> Courses {get; set; }
    public DbSet<CourseCanUseClassroom> CourseCanUseClassrooms {get; set; }
    public DbSet<GroupTakesCourse> GroupTakesCourses {get; set; }
    public DbSet<ProfessorAvailability> ProfessorAvailabilities {get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<StudentGroup> StudentGroups { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "raspored.db");
        options.UseSqlite($"Data Source={dbPath}");
    }

}
