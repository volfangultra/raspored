namespace ProjectNamespace.Models.Info;

public class LessonInfo
{
    public int IdLesson { get; set; }

    public int LessonsPerWeek { get; set; }

    public string Name { get; set; }

    public string Subject { get; set; }

    public List<TimetableElement> Timetable { get; set; }
}
