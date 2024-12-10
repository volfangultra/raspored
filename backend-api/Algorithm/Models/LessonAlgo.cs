using System;
using System.Collections.Generic;
using System.Linq;

namespace ProjectNamespace.Models;

public class LessonAlgo
{
    public int Id { get; set; }

    public int LessonsPerWeek { get; set; }

    public List<int> Timetable { get; set; }

    public void ChangeDayTime(int from, int to)
    {
        var elementIndex = this.Timetable.IndexOf(from);
        this.Timetable[elementIndex] = to;
    }

    public void AddDayTime(int dayTime) => this.Timetable.Add(dayTime);

    public void ChangeTimetable(List<int> newTimetable)
    {
        if (newTimetable.Count != this.LessonsPerWeek)
        {
            throw new ArgumentException("newTimetable has incorrect number of elements");
        }

        this.Timetable.Clear();
        this.Timetable.AddRange(newTimetable);
    }

    public LessonAlgo Copy() => new LessonAlgo(Id, LessonsPerWeek, Timetable.ToList());

    public LessonAlgo(int id, int lessonsPerWeek, List<int> timetable)
    {
        this.Id = id;
        this.LessonsPerWeek = lessonsPerWeek;
        this.Timetable = timetable;
    }
}
