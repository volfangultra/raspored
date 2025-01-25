// <copyright file="AppDbContext.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Data;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Classroom> Classrooms { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Professor> Professors { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseCanNotUseClassroom> CourseCanNotUseClassrooms { get; set; }
    public DbSet<GroupTakesCourses> GroupTakesCourses { get; set; }
    public DbSet<ProfessorUnavailability> ProfessorUnavailabilities { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<StudentGroup> StudentGroups { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        string dbPath = Path.Combine(Directory.GetCurrentDirectory(), "raspored.db");
        options.UseSqlite($"Data Source={dbPath}") ;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Iterate over all relationships in the model and set delete behavior to Restrict
        foreach (var relationship in modelBuilder.Model.GetEntityTypes()
            .SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }
    }

}
