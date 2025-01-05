using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Models;

public static class ScheduleRoutes
{
    public static void MapScheduleRoutes(this WebApplication app) => app.MapGet("/get_schedule/{id}", async ([FromRoute] int id, AppDbContext dbContext) =>
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
