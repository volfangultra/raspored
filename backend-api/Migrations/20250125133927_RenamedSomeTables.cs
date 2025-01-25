using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_api.Migrations
{
    /// <inheritdoc />
    public partial class RenamedSomeTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseCanUseClassrooms");

            migrationBuilder.DropTable(
                name: "ProfessorAvailabilities");

            migrationBuilder.CreateTable(
                name: "CourseCanNotUseClassrooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CourseId = table.Column<int>(type: "INTEGER", nullable: false),
                    ClassroomId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCanNotUseClassrooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseCanNotUseClassrooms_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseCanNotUseClassrooms_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProfessorUnavailabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProfessorId = table.Column<int>(type: "INTEGER", nullable: false),
                    Day = table.Column<int>(type: "INTEGER", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorUnavailabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessorUnavailabilities_Professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseCanNotUseClassrooms_ClassroomId",
                table: "CourseCanNotUseClassrooms",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseCanNotUseClassrooms_CourseId",
                table: "CourseCanNotUseClassrooms",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorUnavailabilities_ProfessorId",
                table: "ProfessorUnavailabilities",
                column: "ProfessorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseCanNotUseClassrooms");

            migrationBuilder.DropTable(
                name: "ProfessorUnavailabilities");

            migrationBuilder.CreateTable(
                name: "CourseCanUseClassrooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClassroomId = table.Column<int>(type: "INTEGER", nullable: false),
                    CourseId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCanUseClassrooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseCanUseClassrooms_Classrooms_ClassroomId",
                        column: x => x.ClassroomId,
                        principalTable: "Classrooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseCanUseClassrooms_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProfessorAvailabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProfessorId = table.Column<int>(type: "INTEGER", nullable: false),
                    Day = table.Column<int>(type: "INTEGER", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorAvailabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProfessorAvailabilities_Professors_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseCanUseClassrooms_ClassroomId",
                table: "CourseCanUseClassrooms",
                column: "ClassroomId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseCanUseClassrooms_CourseId",
                table: "CourseCanUseClassrooms",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorAvailabilities_ProfessorId",
                table: "ProfessorAvailabilities",
                column: "ProfessorId");
        }
    }
}
