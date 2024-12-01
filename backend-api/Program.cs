using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectNamespace.Data;
using ProjectNamespace.Routes;

var builder = WebApplication.CreateBuilder(args);

// Add configuration to read environment variables
builder.Configuration.AddEnvironmentVariables();

var connectionString = builder.Configuration["REACT_APP_DATABASE_PATH"];
var allowedOrigin = builder.Configuration["REACT_APP_URL"];
var validIssuer = builder.Configuration["REACT_APP_API_URL"];
var secretKey = builder.Configuration["SECRET_KEY"];

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite($"Data Source={connectionString}"));

builder.Services.AddCors(options => options.AddPolicy("AllowReactApp", policy => policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = validIssuer,
            ValidAudience = allowedOrigin,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        };
    });

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapStudentRoutes();
app.MapUserRoutes();
app.MapProfessorRoutes();
app.MapClassroomRoutes();
app.MapStudyGroupRoutes();
app.MapTimeslotRoutes();
app.MapProfessorTimeslotRoutes();
app.MapClassroomTimeslotRoutes();
app.MapLessonRoutes();

app.Run();
