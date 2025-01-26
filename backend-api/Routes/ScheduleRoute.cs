// <copyright file="ScheduleRoutes.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace ProjectNamespace.Routes;

using System.Diagnostics;
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

    public class DuplicateRequest
    {
        public int ScheduleId { get; set; }
        public DuplicateOptions DuplicateOptions { get; set; } = new DuplicateOptions();
    }

    public class DuplicateOptions
    {
        public bool Professors { get; set; }
        public bool StudentGroups { get; set; }
        public bool Courses { get; set; }
        public bool Classrooms { get; set; }
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

            if (updatedScheduleDTO.Courses != null)
            {
                schedule.Courses.Clear();
                foreach (var course in updatedScheduleDTO.Courses)
                {
                    var existingCourse = await db.Courses.FindAsync(course.Id);
                    if (existingCourse is null)
                    {
                        return Results.BadRequest($"Course with ID {course.Id} not found.");
                    }
                    schedule.Courses.Add(existingCourse);
                }
            }

            if (updatedScheduleDTO.Classrooms != null)
            {
                schedule.Classrooms.Clear();
                foreach (var classroom in updatedScheduleDTO.Classrooms)
                {
                    var existingClassroom = await db.Classrooms.FindAsync(classroom.Id);
                    if (existingClassroom is null)
                    {
                        return Results.BadRequest($"Classroom with ID {classroom.Id} not found.");
                    }
                    schedule.Classrooms.Add(existingClassroom);
                }
            }

            await db.SaveChangesAsync();
            return Results.Ok(new ScheduleDTO
            {
                Id = schedule.Id,
                UserId = schedule.UserId,
                Name = schedule.Name,
                Semester = schedule.Semester
            });
        });


        app.MapDelete("/schedules/{id:int}", async (int id, AppDbContext db) =>
        {
            var schedule = await db.Schedules
                .Include(s => s.Courses)
                    .ThenInclude(c => c.CourseCanNotUseClassrooms)
                .Include(s => s.Courses)
                    .ThenInclude(c => c.GroupTakesCourses)
                .Include(s => s.Courses)
                    .ThenInclude(c => c.Lessons)
                .Include(s => s.Professors)
                    .ThenInclude(p => p.ProfessorUnavailabilities)
                .Include(s => s.Classrooms)
                .Include(s => s.StudentGroups)
                    .ThenInclude(g => g.GroupTakesCourses)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (schedule is null)
                return Results.NotFound();
            if (schedule.Courses != null)
            {
                foreach (var course in schedule.Courses)
                {
                    if (course.CourseCanNotUseClassrooms != null)
                        db.CourseCanNotUseClassrooms.RemoveRange(course.CourseCanNotUseClassrooms);

                    if (course.GroupTakesCourses != null)
                        db.GroupTakesCourses.RemoveRange(course.GroupTakesCourses);

                    if (course.Lessons != null)
                        db.Lessons.RemoveRange(course.Lessons);
                }
                db.Courses.RemoveRange(schedule.Courses);
            }

            // Remove all professors and their unavailabilities
            if (schedule.Professors != null)
            {
                foreach (var professor in schedule.Professors)
                {
                    if (professor.ProfessorUnavailabilities != null)
                        db.ProfessorUnavailabilities.RemoveRange(professor.ProfessorUnavailabilities);
                }
                db.Professors.RemoveRange(schedule.Professors);
            }

            // Remove all classrooms
            if (schedule.Classrooms != null)
            {
                db.Classrooms.RemoveRange(schedule.Classrooms);
            }

            // Remove all student groups and their related data
            if (schedule.StudentGroups != null)
            {
                foreach (var group in schedule.StudentGroups)
                {
                    if (group.GroupTakesCourses != null)
                        db.GroupTakesCourses.RemoveRange(group.GroupTakesCourses);
                }
                db.StudentGroups.RemoveRange(schedule.StudentGroups);
            }

            // Finally, remove the schedule itself
            db.Schedules.Remove(schedule);

            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        app.MapPost("/schedules/duplicate", async ([FromBody] DuplicateRequest request, HttpContext httpContext, AppDbContext db) =>
        {
            using var transaction = await db.Database.BeginTransactionAsync();

            try
            {
                if (!httpContext.Request.Headers.TryGetValue("Authorization", out var userIdHeader))
                {
                    return Results.BadRequest(new { message = "User ID is missing." });
                }

                if (!int.TryParse(userIdHeader.ToString(), out var userId))
                {
                    return Results.BadRequest(new { message = "Invalid User ID format." });
                }

                var originalSchedule = await db.Schedules
                    .Where(s => s.Id == request.ScheduleId)
                    .FirstOrDefaultAsync();

                if (originalSchedule is null)
                {
                    return Results.NotFound(new { message = "Original schedule not found." });
                }

                var newSchedule = new Schedule
                {
                    UserId = userId,
                    Name = $"{originalSchedule.Name} - Copy",
                    Semester = originalSchedule.Semester,
                };

                db.Schedules.Add(newSchedule);
                await db.SaveChangesAsync();

                if (request.DuplicateOptions.Professors)
                {
                    var originalProfessors = await db.Professors
                        .Where(p => p.ScheduleId == originalSchedule.Id)
                        .Include(p => p.ProfessorUnavailabilities)
                        .ToListAsync();

                    var duplicatedProfessors = originalProfessors.Select(professor => new Professor
                    {
                        Name = professor.Name,
                        Rank = professor.Rank,
                        ScheduleId = newSchedule.Id,
                        ProfessorUnavailabilities = professor.ProfessorUnavailabilities.Select(u => new ProfessorUnavailability
                        {
                            StartTime = u.StartTime,
                            EndTime = u.EndTime,
                        }).ToList(),
                    }).ToList();

                    db.Professors.AddRange(duplicatedProfessors);
                }
                await db.SaveChangesAsync();


                var duplicatedClassrooms = new List<Classroom>();
                if (request.DuplicateOptions.Classrooms)
                {
                    var originalClassrooms = await db.Classrooms
                       .Where(p => p.ScheduleId == originalSchedule.Id)
                       .ToListAsync();

                    duplicatedClassrooms = originalClassrooms.Select(classroom => new Classroom
                    {
                        Name = classroom.Name,
                        Floor = classroom.Floor,
                        Capacity = classroom.Capacity,
                        ScheduleId = newSchedule.Id,
                    }).ToList();

                    db.Classrooms.AddRange(duplicatedClassrooms);
                }
                await db.SaveChangesAsync();

                var duplicatedCourses = new List<Course>();
                if (request.DuplicateOptions.Courses)
                {
                    var originalCourses = await db.Courses
                       .Where(p => p.ScheduleId == originalSchedule.Id)
                       .ToListAsync();

                    duplicatedCourses = originalCourses.Select(course => new Course
                    {
                        Name = course.Name,
                        Type = course.Type,
                        LectureSlotLength = course.LectureSlotLength,
                        ScheduleId = newSchedule.Id,
                        ProfessorId = db.Professors
                                        .Where(p => p.ScheduleId == newSchedule.Id && p.Name == course.Professor.Name)
                                        .Select(p => p.Id)
                                        .FirstOrDefault(),
                    }).ToList();

                    db.Courses.AddRange(duplicatedCourses);
                }
                await db.SaveChangesAsync();


                var duplicatedStudentGroups = new List<StudentGroup>();
                if (request.DuplicateOptions.StudentGroups)
                {
                    var originalStudentGroups = await db.StudentGroups
                        .Where(p => p.ScheduleId == originalSchedule.Id)
                        .ToListAsync();

                    duplicatedStudentGroups = originalStudentGroups.Select(group => new StudentGroup
                    {
                        Major = group.Major,
                        Year = group.Year,
                        Name = group.Name,
                        ScheduleId = newSchedule.Id,
                    }).ToList();

                    db.StudentGroups.AddRange(duplicatedStudentGroups);
                }
                await db.SaveChangesAsync();

                if (request.DuplicateOptions.Courses && request.DuplicateOptions.StudentGroups)
                {
                    var originalStudentGroups = await db.StudentGroups
                        .Where(p => p.ScheduleId == originalSchedule.Id)
                        .Include(p => p.GroupTakesCourses)
                        .ToListAsync();

                    var duplicatedGroupTakesCourses = originalStudentGroups
                        .SelectMany(g => g.GroupTakesCourses)
                        .Select(originalGroupTakesCourse => new GroupTakesCourses
                        {
                            CourseId = db.Courses
                                        .Where(c => c.Name == originalGroupTakesCourse.Course.Name && c.ScheduleId == newSchedule.Id)
                                        .Select(c => c.Id)
                                        .FirstOrDefault(),
                            StudentGroupId = db.StudentGroups
                                            .Where(sg => sg.Name == originalGroupTakesCourse.StudentGroup.Name && sg.ScheduleId == newSchedule.Id)
                                            .Select(sg => sg.Id)
                                            .FirstOrDefault(),
                        })
                        .ToList();

                    db.GroupTakesCourses.AddRange(duplicatedGroupTakesCourses);
                }
                await db.SaveChangesAsync();

                if (request.DuplicateOptions.Courses && request.DuplicateOptions.Classrooms)
                {
                    var originalClassrooms = db.Classrooms
                        .Where(c => c.ScheduleId == originalSchedule.Id)
                        .Include(p => p.CourseCanNotUseClassrooms)
                        .ToList();

                    var duplicatedCourseCanNotUseClassrooms = originalClassrooms
                        .SelectMany(g => g.CourseCanNotUseClassrooms)
                        .Select(cc => new CourseCanNotUseClassroom
                        {
                            CourseId = db.Courses
                                        .Where(c => c.Name == cc.Course.Name && c.ScheduleId == newSchedule.Id)
                                        .Select(c => c.Id)
                                        .FirstOrDefault(),
                            ClassroomId = db.Classrooms
                                          .Where(cls => cls.Name == cc.Classroom.Name && cls.ScheduleId == newSchedule.Id)
                                          .Select(cls => cls.Id)
                                          .FirstOrDefault(),
                        })
                        .ToList();

                    db.CourseCanNotUseClassrooms.AddRange(duplicatedCourseCanNotUseClassrooms);
                }

                await db.SaveChangesAsync();

                await transaction.CommitAsync();

                return Results.Ok(new { message = "Timetable duplicated and saved successfully!" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Results.Problem($"An error occurred while duplicating the schedule: {ex.Message}");
            }
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
                                                                                              // Include professorUnavailabilities (Day, StartTime, EndTime)
                                                                                              professorUnavailabilities = c.Professor.ProfessorUnavailabilities.Select(pa => new
                                                                                              {
                                                                                                  pa.Day,
                                                                                                  pa.StartTime,
                                                                                                  pa.EndTime
                                                                                              })
                                                                                          },
                                                                                          // Include CanUseClassroom (Classroom Id, Name, Floor)
                                                                                          CanUseClassroom = c.CourseCanNotUseClassrooms.Select(ccu => new
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
