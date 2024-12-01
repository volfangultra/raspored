using System.Collections.Generic;

namespace ProjectNamespace.Models;

public class StudyGroupAlgo
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

    public StudyGroupAlgo Copy(List<LessonAlgo> teachingGroups) => new(Id, teachingGroups);

    public StudyGroupAlgo(int id, List<LessonAlgo> teachingGroups)
    {
        this.Id = id;
        this.LessonGroups = teachingGroups;
    }
}
