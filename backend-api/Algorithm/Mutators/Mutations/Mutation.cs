namespace ProjectNamespace.Mutations;

using ProjectNamespace.Models;

public class Mutation : IMutation
{
    public List<MutationHistory> Mutate(List<LessonAlgo> teachingGroups, List<KeyValuePair<short, short>> availableWeekDays, Random random = null)
    {
        if (teachingGroups.Count < 1)
        {
            throw new ArgumentException("At least one taching group is required");
        }

        random ??= new Random();

        var result = new List<MutationHistory>();

        var teachingGroup = teachingGroups[random.Next(0, teachingGroups.Count)];
        var timetableElement = teachingGroup.Timetable[random.Next(0, teachingGroup.Timetable.Count)];

        var weekDay = availableWeekDays[random.Next(0, availableWeekDays.Count)];
        var newTimetableElement = weekDay.Key * 100 + random.Next(1, weekDay.Value + 1);

        teachingGroup.ChangeDayTime(timetableElement, newTimetableElement);
        result.Add(new MutationHistory { IdLesson = teachingGroup.Id, OldValue = timetableElement, NewValue = newTimetableElement });
        return result;
    }
}
