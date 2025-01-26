﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjectNamespace.Data;

#nullable disable

namespace backend_api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250126124948_ChangedSchedule")]
    partial class ChangedSchedule
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("ProjectNamespace.Models.Classroom", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Capacity")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Floor")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ScheduleId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ScheduleId");

                    b.ToTable("Classrooms");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Course", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("LectureSlotLength")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ProfessorId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ScheduleId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProfessorId");

                    b.HasIndex("ScheduleId");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("ProjectNamespace.Models.CourseCanNotUseClassroom", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ClassroomId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CourseId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ClassroomId");

                    b.HasIndex("CourseId");

                    b.ToTable("CourseCanNotUseClassrooms");
                });

            modelBuilder.Entity("ProjectNamespace.Models.GroupTakesCourses", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CourseId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("StudentGroupId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.HasIndex("StudentGroupId");

                    b.ToTable("GroupTakesCourses");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Lesson", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ClassroomId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CourseId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Day")
                        .HasColumnType("INTEGER");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("TEXT");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ClassroomId");

                    b.HasIndex("CourseId");

                    b.ToTable("Lessons");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Professor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Rank")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ScheduleId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ScheduleId");

                    b.ToTable("Professors");
                });

            modelBuilder.Entity("ProjectNamespace.Models.ProfessorUnavailability", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Day")
                        .HasColumnType("INTEGER");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProfessorId")
                        .HasColumnType("INTEGER");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProfessorId");

                    b.ToTable("ProfessorUnavailabilities");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Schedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Semester")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Schedules");
                });

            modelBuilder.Entity("ProjectNamespace.Models.StudentGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Major")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("ScheduleId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Year")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ScheduleId");

                    b.ToTable("StudentGroups");
                });

            modelBuilder.Entity("ProjectNamespace.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("College")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Classroom", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Schedule", "Schedule")
                        .WithMany("Classrooms")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Course", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Professor", "Professor")
                        .WithMany("Courses")
                        .HasForeignKey("ProfessorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ProjectNamespace.Models.Schedule", "Schedule")
                        .WithMany("Courses")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Professor");

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ProjectNamespace.Models.CourseCanNotUseClassroom", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Classroom", "Classroom")
                        .WithMany("CourseCanNotUseClassrooms")
                        .HasForeignKey("ClassroomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ProjectNamespace.Models.Course", "Course")
                        .WithMany("CourseCanNotUseClassrooms")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Classroom");

                    b.Navigation("Course");
                });

            modelBuilder.Entity("ProjectNamespace.Models.GroupTakesCourses", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Course", "Course")
                        .WithMany("GroupTakesCourses")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ProjectNamespace.Models.StudentGroup", "StudentGroup")
                        .WithMany("GroupTakesCourses")
                        .HasForeignKey("StudentGroupId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("StudentGroup");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Lesson", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Classroom", "Classroom")
                        .WithMany("Lessons")
                        .HasForeignKey("ClassroomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("ProjectNamespace.Models.Course", "Course")
                        .WithMany("Lessons")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Classroom");

                    b.Navigation("Course");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Professor", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Schedule", "Schedule")
                        .WithMany("Professors")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ProjectNamespace.Models.ProfessorUnavailability", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Professor", "Professor")
                        .WithMany("ProfessorUnavailabilities")
                        .HasForeignKey("ProfessorId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Professor");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Schedule", b =>
                {
                    b.HasOne("ProjectNamespace.Models.User", "User")
                        .WithMany("Schedules")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProjectNamespace.Models.StudentGroup", b =>
                {
                    b.HasOne("ProjectNamespace.Models.Schedule", "Schedule")
                        .WithMany("StudentGroups")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Classroom", b =>
                {
                    b.Navigation("CourseCanNotUseClassrooms");

                    b.Navigation("Lessons");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Course", b =>
                {
                    b.Navigation("CourseCanNotUseClassrooms");

                    b.Navigation("GroupTakesCourses");

                    b.Navigation("Lessons");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Professor", b =>
                {
                    b.Navigation("Courses");

                    b.Navigation("ProfessorUnavailabilities");
                });

            modelBuilder.Entity("ProjectNamespace.Models.Schedule", b =>
                {
                    b.Navigation("Classrooms");

                    b.Navigation("Courses");

                    b.Navigation("Professors");

                    b.Navigation("StudentGroups");
                });

            modelBuilder.Entity("ProjectNamespace.Models.StudentGroup", b =>
                {
                    b.Navigation("GroupTakesCourses");
                });

            modelBuilder.Entity("ProjectNamespace.Models.User", b =>
                {
                    b.Navigation("Schedules");
                });
#pragma warning restore 612, 618
        }
    }
}
