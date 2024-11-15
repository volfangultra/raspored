using Microsoft.EntityFrameworkCore;
using ProjectNamespace.Data;
using ProjectNamespace.Routes;

var builder = WebApplication.CreateBuilder(args);

// Add configuration to read environment variables
builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration["REACT_APP_DATABASE_PATH"];
var allowedOrigin = builder.Configuration["REACT_APP_URL"];

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={connectionString}"));

builder.Services.AddCors(options => options.AddPolicy("AllowReactApp", policy => policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();
app.UseCors("AllowReactApp");

app.MapStudentRoutes();
app.MapProfessorRoutes();
app.MapClassroomRoutes();
app.MapStudyGroupRoutes();
app.MapTimeslotRoutes();
app.MapProfessorTimeslotRoutes();
app.MapClassroomTimeslotRoutes();
app.MapLessonRoutes();

app.Run();