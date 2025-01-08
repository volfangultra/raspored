// <copyright file="ScheduleRoutes.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ScheduleRoutes
{
    public class ScheduleDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string Semester { get; set; }

        public ICollection<Course> Courses { get; set; }

        public ICollection<Classroom> Classrooms { get; set; }
    }

    public static void MapScheduleRoutes(this WebApplication app)
    {
        app.MapGet("/schedules", async (AppDbContext db) =>
        {
            var schedules = await db.Schedules
                .Include(s => s.Courses)
                .Include(s => s.Classrooms)
                .Select(s => new ScheduleDTO
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    Name = s.Name,
                    Semester = s.Semester,
                    Courses = s.Courses,
                    Classrooms = s.Classrooms
                })
                .ToListAsync();
            return Results.Ok(schedules);
        });

        app.MapGet("/schedules/{id:int}", async (int id, AppDbContext db) =>
        {
            var schedule = await db.Schedules
                .Include(s => s.Courses)
                .Include(s => s.Classrooms)
                .Where(s => s.Id == id)
                .Select(s => new ScheduleDTO
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    Name = s.Name,
                    Semester = s.Semester,
                    Courses = s.Courses,
                    Classrooms = s.Classrooms
                })
                .FirstOrDefaultAsync();

            return schedule is not null ? Results.Ok(schedule) : Results.NotFound();
        });

        app.MapGet("/schedules/user/{userId:int}", async (int userId, AppDbContext db) =>
        {
            var schedules = await db.Schedules
                .Include(s => s.Courses)
                .Include(s => s.Classrooms)
                .Where(s => s.UserId == userId)
                .Select(s => new ScheduleDTO
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    Name = s.Name,
                    Semester = s.Semester,
                    Courses = s.Courses,
                    Classrooms = s.Classrooms
                })
                .ToListAsync();

            return schedules.Any() ? Results.Ok(schedules) : Results.NotFound();
        });

        app.MapPost("/schedules", async (ScheduleDTO scheduleDTO, AppDbContext db) =>
        {
            var schedule = new Schedule
            {
                UserId = scheduleDTO.UserId,
                Name = scheduleDTO.Name,
                Semester = scheduleDTO.Semester,
                Courses = scheduleDTO.Courses,
                Classrooms = scheduleDTO.Classrooms
            };

            db.Schedules.Add(schedule);
            await db.SaveChangesAsync();
            return Results.Ok(new { Id = schedule.Id });
        });

        app.MapPut("/schedules/{id:int}", async (int id, ScheduleDTO updatedScheduleDTO, AppDbContext db) =>
        {
            var schedule = await db.Schedules
                .Include(s => s.Courses)
                .Include(s => s.Classrooms)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (schedule is null)
                return Results.NotFound();

            schedule.Name = updatedScheduleDTO.Name;
            schedule.Semester = updatedScheduleDTO.Semester;
            schedule.UserId = updatedScheduleDTO.UserId;
            schedule.Courses = updatedScheduleDTO.Courses;
            schedule.Classrooms = updatedScheduleDTO.Classrooms;

            await db.SaveChangesAsync();
            return Results.Ok(new ScheduleDTO
            {
                Id = schedule.Id,
                UserId = schedule.UserId,
                Name = schedule.Name,
                Semester = schedule.Semester,
                Courses = schedule.Courses,
                Classrooms = schedule.Classrooms
            });
        });

        app.MapDelete("/schedules/{id:int}", async (int id, AppDbContext db) =>
        {
            var schedule = await db.Schedules.FindAsync(id);
            if (schedule is null)
                return Results.NotFound();

            db.Schedules.Remove(schedule);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapGet("/get_schedule/{id}", async ([FromRoute] int id, AppDbContext dbContext) =>
                                                                          {
                                                                              var schedule = await dbContext.Schedules
                                                                                  .Where(s => s.Id == id)
                                                                                  .Select(s => new
                                                                                  {
                                                                                      s.Id,
                                                                                      s.UserId,
                                                                                      s.Name,
                                                                                      s.Semester,
                                                                                      // Include Courses with Professor, Classroom CanUseClassroom, GroupTakesCourse, and Lessons
                                                                                      Courses = s.Courses.Select(c => new
                                                                                      {
                                                                                          c.Id,
                                                                                          c.Name,
                                                                                          c.Type,
                                                                                          c.LectureSlotLength,
                                                                                          // Include Professor details (Name and Rank)
                                                                                          Professor = new
                                                                                          {
                                                                                              c.Professor.Id,
                                                                                              c.Professor.Name,
                                                                                              c.Professor.Rank,
                                                                                              // Include ProfessorAvailabilities (Day, StartTime, EndTime)
                                                                                              ProfessorAvailabilities = c.Professor.ProfessorAvailabilities.Select(pa => new
                                                                                              {
                                                                                                  pa.Day,
                                                                                                  pa.StartTime,
                                                                                                  pa.EndTime
                                                                                              })
                                                                                          },
                                                                                          // Include CanUseClassroom (Classroom Id, Name, Floor)
                                                                                          CanUseClassroom = c.CourseCanUseClassrooms.Select(ccu => new
                                                                                          {
                                                                                              ccu.Classroom.Id,
                                                                                              ccu.Classroom.Name,
                                                                                              ccu.Classroom.Floor
                                                                                          }),
                                                                                          // Include GroupTakesCourse (StudentGroupId, Major, Year, Name)
                                                                                          GroupTakesCourse = c.GroupTakesCourses.Select(gtc => new
                                                                                          {
                                                                                              gtc.StudentGroupId,
                                                                                              gtc.StudentGroup.Major,
                                                                                              gtc.StudentGroup.Year,
                                                                                              gtc.StudentGroup.Name
                                                                                          }),
                                                                                          // Include Lesson (ClassroomId, Day, StartTime, EndTime)
                                                                                          Lesson = c.Lessons.Select(l => new
                                                                                          {
                                                                                              l.ClassroomId,
                                                                                              l.Day,
                                                                                              l.StartTime,
                                                                                              l.EndTime
                                                                                          }).FirstOrDefault()
                                                                                      }),
                                                                                      // Include Classrooms
                                                                                      Classrooms = s.Classrooms.Select(c => new
                                                                                      {
                                                                                          c.Id,
                                                                                          c.Name,
                                                                                          c.Floor,
                                                                                          // Include Schedule details for Classroom (Id and Name)
                                                                                          Schedule = new
                                                                                          {
                                                                                              c.Schedule.Id,
                                                                                              c.Schedule.Name
                                                                                          }
                                                                                      })
                                                                                  })
                                                                                  .FirstOrDefaultAsync();

                                                                              if (schedule == null)
                                                                              {
                                                                                  return Results.NotFound(new { message = "Schedule not found." });
                                                                              }

                                                                              return Results.Ok(schedule);
                                                                          });
    }
}
