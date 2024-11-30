namespace ProjectNamespace.TimetableSolver;
using ProjectNamespace.Models;
using ProjectNamespace.Models.Info;
using ProjectNamespace.TimetableHelpers;

public class TimetableInfoBuilder
{
    private List<StudyGroupInfo> studyGroups;
    private List<ProfessorInfo> professors;
    private List<LessonInfo> lessons;

    private List<StudyGroupAssignedLesson> studyGroupAssignedLesson;

    private List<ProfessorAssignedLesson> professorAssignedLesson;

    private List<TimeslotInfo> timeslots;

    public TimetableInfoBuilder()
    {
        this.studyGroups = [];
        this.professors = [];
        this.lessons = [];
        this.studyGroupAssignedLesson = [];
        this.professorAssignedLesson = [];
        this.timeslots = [];
    }

    public TimetableInfoBuilder AddStudyGroup(int id, string cycle, string program, string department, string year)
    {
        this.studyGroups.Add(new StudyGroupInfo { IdStudyGroup = id, NameStudyGroup = department + " - " + cycle + " - " + program + " - " + year });
        return this;
    }

    public TimetableInfoBuilder AddProfessor(int idTeacher, string name)
    {
        this.professors.Add(new ProfessorInfo { IdProfessor = idTeacher, NameProfessor = name });
        return this;
    }

    public TimetableInfoBuilder AddLesson(int idLesson, int lessonsPerWeek, string name, string subject, List<int> timetable = null)
    {
        timetable ??= [];
        var timetableElements = timetable.Select(s => new TimetableElement { LessonNumber = s % 10, DayOfWeek = TimetableHelper.GetDayOfWeek((short)(s / 100)) }).ToList();
        this.lessons.Add(new LessonInfo
        {
            IdLesson = idLesson,
            LessonsPerWeek = lessonsPerWeek,
            Name = name,
            Subject = subject,

            Timetable = timetableElements,
        });
        return this;
    }

    public TimetableInfoBuilder AddStudyGroupAssignment(int idStudyGroup, int idLesson)
    {
        this.studyGroupAssignedLesson.Add(new StudyGroupAssignedLesson { IdStudyGroup = idStudyGroup, IdLesson = idLesson });
        return this;
    }

    public TimetableInfoBuilder AddProfessorAssignment(int idProfessor, int idLesson)
    {
        this.professorAssignedLesson.Add(new ProfessorAssignedLesson { IdProfessor = idProfessor, IdLesson = idLesson });
        return this;
    }

    public TimetableInfoBuilder AddTimeslot(string dayOfWeek, int numberOfLessons)
    {
        this.timeslots.Add(new TimeslotInfo { DayOfWeek = dayOfWeek, NumberOfLessons = numberOfLessons });
        return this;
    }

    public TimetableInfo Build()
    {
        var result = new TimetableInfo
        {
            StudyGroups = this.studyGroups,
            Professors = this.professors,
            Lessons = this.lessons,
            StudyGroupAssignedLesson = this.studyGroupAssignedLesson,
            ProfessorAssignedLesson = this.professorAssignedLesson,
            Timeslots = this.timeslots,
        };

        this.studyGroups = [];
        this.professors = [];
        this.lessons = [];
        this.studyGroupAssignedLesson = [];
        this.professorAssignedLesson = [];
        this.timeslots = [];

        return result;
    }

    public static TimetableInfo GetTimetableInfo()
    {
        var builder = new TimetableInfoBuilder();

        builder.AddStudyGroup(101, "1. Ciklus", "KN", "Matematika", "1. Godina")
        .AddStudyGroup(102, "1. Ciklus", "KN", "Matematika", "2. Godina")
        .AddStudyGroup(103, "1. Ciklus", "KN", "Matematika", "3. Godina")
        .AddStudyGroup(104, "1. Ciklus", "KN", "Matematika", "4. Godina");

        builder.AddProfessor(201, "Albert Einstein")
        .AddProfessor(202, "Charles Darwin")
        .AddProfessor(203, "John von Neumann");

        builder.AddLesson(301, 3, "PHY1", "Physics")
        .AddLesson(302, 3, "PHY2", "Physics")
        .AddLesson(303, 3, "PHY3", "Physics")
        .AddLesson(304, 3, "PHY4", "Physics")

        .AddLesson(305, 3, "BIO1", "Biology")
        .AddLesson(306, 3, "BIO2", "Biology")
        .AddLesson(307, 3, "BIO3", "Biology")
        .AddLesson(308, 3, "BIO4", "Biology")

        .AddLesson(309, 3, "COMP1", "Computer science")
        .AddLesson(310, 3, "COMP2", "Computer science")
        .AddLesson(311, 3, "COMP3", "Computer science")
        .AddLesson(312, 3, "COMP4", "Computer science");

        builder.AddStudyGroupAssignment(104, 304)
           .AddStudyGroupAssignment(104, 308)
           .AddStudyGroupAssignment(104, 312)
           .AddProfessorAssignment(201, 304)
           .AddProfessorAssignment(202, 308)
           .AddProfessorAssignment(203, 312);

        builder.AddStudyGroupAssignment(103, 303)
            .AddStudyGroupAssignment(103, 307)
            .AddStudyGroupAssignment(103, 311)
            .AddProfessorAssignment(201, 303)
            .AddProfessorAssignment(202, 307)
            .AddProfessorAssignment(203, 311);

        builder.AddStudyGroupAssignment(102, 302)
            .AddStudyGroupAssignment(102, 306)
            .AddStudyGroupAssignment(102, 310)
            .AddProfessorAssignment(201, 302)
            .AddProfessorAssignment(202, 306)
            .AddProfessorAssignment(203, 310);

        builder.AddStudyGroupAssignment(101, 301)
            .AddStudyGroupAssignment(101, 305)
            .AddStudyGroupAssignment(101, 309)
            .AddProfessorAssignment(201, 301)
            .AddProfessorAssignment(202, 305)
            .AddProfessorAssignment(203, 309);

        builder.AddTimeslot("Monday", 5)
            .AddTimeslot("Tuesday", 5)
            .AddTimeslot("Wednesday", 5);

        return builder.Build();
    }

    // public static TimetableInfo GetRandomTimetableInfo(int classCount, int lessonsPerWeekForClass, int lessonsPerWeekForTeacher, int numberOfLessons, Random random = null)
    // {
    //     var availableWeekDays = new List<AvailableWeekDayInfo>
    //         {
    //             new AvailableWeekDayInfo
    //             {
    //                 DayOfWeek = DayOfWeek.Monday,
    //                 NumberOfLessons = numberOfLessons
    //             },
    //             new AvailableWeekDayInfo
    //             {
    //                 DayOfWeek = DayOfWeek.Tuesday,
    //                 NumberOfLessons = numberOfLessons
    //             },
    //             new AvailableWeekDayInfo
    //             {
    //                 DayOfWeek = DayOfWeek.Wednesday,
    //                 NumberOfLessons = numberOfLessons
    //             },
    //             new AvailableWeekDayInfo
    //             {
    //                 DayOfWeek = DayOfWeek.Thursday,
    //                 NumberOfLessons = numberOfLessons
    //             },
    //             new AvailableWeekDayInfo
    //             {
    //                 DayOfWeek = DayOfWeek.Friday,
    //                 NumberOfLessons = numberOfLessons
    //             },
    //         };
    //     var timetableInfoGenrator = new TimetableInfoByClassGenerator(classCount, lessonsPerWeekForClass, lessonsPerWeekForTeacher, availableWeekDays, random ?? new Random());
    //     return timetableInfoGenrator.Generate();
    // }
}
