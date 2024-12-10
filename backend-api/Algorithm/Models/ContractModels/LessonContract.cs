namespace ProjectNamespace.Models.Contracts;

public class LessonContract
{
    public int Id { get; set; }

    public int LessonsPerWeek { get; set; }

    public List<TimetableElementContract> Timetable { get; set; }
}
