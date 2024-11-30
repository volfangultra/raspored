using System.Collections.Generic;

namespace ProjectNamespace.Models;

public class ProfessorAlgo
{
    public int Id { get; set; }

    public List<LessonAlgo> LessonGroups { get; set; }

    public List<int> GetTimetable()
    {
        var result = new List<int>();

        foreach (var teachingGroup in this.LessonGroups)
        {
            foreach (var dayTime in teachingGroup.Timetable)
            {
                result.Add(dayTime);
            }
        }

        return result;
    }

    public HashSet<int> GetTimetableHashSet()
    {
        var result = new HashSet<int>();
        foreach (var teachingGroup in this.LessonGroups)
        {
            foreach (var dayTime in teachingGroup.Timetable)
            {
                result.Add(dayTime);
            }
        }

        return result;
    }

    public ProfessorAlgo Copy(List<LessonAlgo> lessonGroups) => new ProfessorAlgo(Id, lessonGroups);

    public ProfessorAlgo(int id, List<LessonAlgo> lessonGroups)
    {
        this.Id = id;
        this.LessonGroups = lessonGroups;
    }
}

