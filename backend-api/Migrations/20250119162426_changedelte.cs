using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_api.Migrations
{
    /// <inheritdoc />
    public partial class changedelte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Schedules_ScheduleId",
                table: "Classrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseCanUseClassrooms_Classrooms_ClassroomId",
                table: "CourseCanUseClassrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseCanUseClassrooms_Courses_CourseId",
                table: "CourseCanUseClassrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Professors_ProfessorId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Schedules_ScheduleId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupTakesCourses_Courses_CourseId",
                table: "GroupTakesCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupTakesCourses_StudentGroups_StudentGroupId",
                table: "GroupTakesCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Classrooms_ClassroomId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfessorAvailabilities_Professors_ProfessorId",
                table: "ProfessorAvailabilities");

            migrationBuilder.DropForeignKey(
                name: "FK_Professors_Schedules_ScheduleId",
                table: "Professors");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Users_UserId",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentGroups_Schedules_ScheduleId",
                table: "StudentGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Schedules_ScheduleId",
                table: "Classrooms",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseCanUseClassrooms_Classrooms_ClassroomId",
                table: "CourseCanUseClassrooms",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseCanUseClassrooms_Courses_CourseId",
                table: "CourseCanUseClassrooms",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Professors_ProfessorId",
                table: "Courses",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Schedules_ScheduleId",
                table: "Courses",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupTakesCourses_Courses_CourseId",
                table: "GroupTakesCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupTakesCourses_StudentGroups_StudentGroupId",
                table: "GroupTakesCourses",
                column: "StudentGroupId",
                principalTable: "StudentGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Classrooms_ClassroomId",
                table: "Lessons",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfessorAvailabilities_Professors_ProfessorId",
                table: "ProfessorAvailabilities",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Professors_Schedules_ScheduleId",
                table: "Professors",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Users_UserId",
                table: "Schedules",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGroups_Schedules_ScheduleId",
                table: "StudentGroups",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classrooms_Schedules_ScheduleId",
                table: "Classrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseCanUseClassrooms_Classrooms_ClassroomId",
                table: "CourseCanUseClassrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseCanUseClassrooms_Courses_CourseId",
                table: "CourseCanUseClassrooms");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Professors_ProfessorId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Schedules_ScheduleId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupTakesCourses_Courses_CourseId",
                table: "GroupTakesCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupTakesCourses_StudentGroups_StudentGroupId",
                table: "GroupTakesCourses");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Classrooms_ClassroomId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfessorAvailabilities_Professors_ProfessorId",
                table: "ProfessorAvailabilities");

            migrationBuilder.DropForeignKey(
                name: "FK_Professors_Schedules_ScheduleId",
                table: "Professors");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedules_Users_UserId",
                table: "Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentGroups_Schedules_ScheduleId",
                table: "StudentGroups");

            migrationBuilder.AddForeignKey(
                name: "FK_Classrooms_Schedules_ScheduleId",
                table: "Classrooms",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseCanUseClassrooms_Classrooms_ClassroomId",
                table: "CourseCanUseClassrooms",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseCanUseClassrooms_Courses_CourseId",
                table: "CourseCanUseClassrooms",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Professors_ProfessorId",
                table: "Courses",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Schedules_ScheduleId",
                table: "Courses",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupTakesCourses_Courses_CourseId",
                table: "GroupTakesCourses",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupTakesCourses_StudentGroups_StudentGroupId",
                table: "GroupTakesCourses",
                column: "StudentGroupId",
                principalTable: "StudentGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Classrooms_ClassroomId",
                table: "Lessons",
                column: "ClassroomId",
                principalTable: "Classrooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Courses_CourseId",
                table: "Lessons",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfessorAvailabilities_Professors_ProfessorId",
                table: "ProfessorAvailabilities",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Professors_Schedules_ScheduleId",
                table: "Professors",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedules_Users_UserId",
                table: "Schedules",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGroups_Schedules_ScheduleId",
                table: "StudentGroups",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
