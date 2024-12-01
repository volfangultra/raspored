namespace ProjectNamespace.FitnessCalculators;
using ProjectNamespace.Models;
using ProjectNamespace.TimetableHelpers;

public class FitnessCalculator : IFitnessCalculator
{
    private int professorCollisionPenalty;
    private int professorWindowPenalty;
    private int studyGroupCollisionPenalty;
    private int studyGroupWindowPenalty;
    private int studyGroupFrontWindowPenalty;

    private Timetable timetable;

    private List<ProfessorAlgo> professors { get; set; }

    private List<StudyGroupAlgo> studyGroups { get; set; }

    private List<int> weekDayTimes;
    private List<int> weekDayNumbers;

    public FitnessCalculator(
        int professorCollisionPenalty,
        int professorWindowPenalty,
        int studyGroupCollisionPenalty,
        int studyGroupWindowPenalty,
        int studyGroupFrontWindowPenalty)
    {
        this.professorCollisionPenalty = professorCollisionPenalty;
        this.professorWindowPenalty = professorWindowPenalty;
        this.studyGroupCollisionPenalty = studyGroupCollisionPenalty;
        this.studyGroupWindowPenalty = studyGroupWindowPenalty;
        this.studyGroupFrontWindowPenalty = studyGroupFrontWindowPenalty;
    }

    public void SetTimetable(Timetable timetable)
    {
        this.timetable = timetable;
        this.professors = timetable.Professors;
        this.studyGroups = timetable.StudyGroups;
        this.weekDayTimes = TimetableHelper.AvailableDayTimes(timetable.Timeslots).OrderBy(x => x).ToList();
        this.weekDayNumbers = this.weekDayTimes.Select(s => s / 100 * 100).Distinct().OrderBy(x => x).ToList();
    }

    public int GetFitness(List<int> modifiedTeachingGroups = null)
    {
        this.CheckTimetableSet();

        var result = 0;

        if (this.professorCollisionPenalty > 0)
        {
            result += this.ProfessorCollisions() * this.professorCollisionPenalty;
        }

        if (this.professorWindowPenalty > 0)
        {
            result += this.ProfessorWindows() * this.professorWindowPenalty;
        }

        if (this.studyGroupCollisionPenalty > 0)
        {
            result += this.StudyGroupCollisions() * this.studyGroupCollisionPenalty;
        }

        if (this.studyGroupWindowPenalty > 0 && this.studyGroupFrontWindowPenalty > 0)
        {
            result += this.ClassWindowsAndFrontWindowsFitness();
        }
        else
        {
            if (this.studyGroupWindowPenalty > 0)
            {
                result += this.StudyGroupWindows() * this.studyGroupWindowPenalty;
            }

            if (this.studyGroupFrontWindowPenalty > 0)
            {
                result += this.ClassFrontWindows() * this.studyGroupFrontWindowPenalty;
            }
        }

        return result;
    }

    public int ProfessorCollisions()
    {
        var result = 0;

        for (var i = 0; i < this.professors.Count; i++)
        {
            var teacher = this.professors[i];
            var timetable = teacher.GetTimetable();
            result += timetable.Count - timetable.Distinct().Count();
        }

        return result;
    }

    public int ProfessorWindows()
    {
        var result = 0;

        foreach (var teacher in this.professors)
        {
            var timetableHashSet = teacher.GetTimetableHashSet();
            var weekDayNumberIndex = 0;
            var weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
            var foundCount = 0;
            var windowsCount = 0;
            var windowsSinceLast = 0;

            foreach (var weekDayTime in this.weekDayTimes)
            {
                if ((weekDayTime - weekDayNumber) > 100)
                {
                    weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
                    result += windowsCount - windowsSinceLast;
                    foundCount = 0;
                    windowsCount = 0;
                    windowsSinceLast = 0;
                }

                var contains = timetableHashSet.Contains(weekDayTime);

                if (contains)
                {
                    foundCount++;
                    windowsSinceLast = 0;
                }

                if (foundCount > 0 && !contains)
                {
                    windowsCount++;
                    windowsSinceLast++;
                }
            }
            result += windowsCount - windowsSinceLast;
        }

        return result;
    }

    public int StudyGroupCollisions()
    {
        var result = 0;

        foreach (var @class in this.studyGroups)
        {
            var timetable = @class.GetTimetable();
            result += timetable.Count - timetable.Distinct().Count();
        }

        return result;
    }

    public int StudyGroupWindows()
    {
        var result = 0;

        foreach (var @class in this.studyGroups)
        {
            var timetableHashSet = @class.GetTimetableHashSet();
            var weekDayNumberIndex = 0;
            var weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
            var foundCount = 0;
            var windowsCount = 0;
            var windowsSinceLast = 0;

            foreach (var weekDayTime in this.weekDayTimes)
            {
                if ((weekDayTime - weekDayNumber) > 100)
                {
                    weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
                    result += windowsCount - windowsSinceLast;
                    foundCount = 0;
                    windowsCount = 0;
                    windowsSinceLast = 0;
                }

                var contains = timetableHashSet.Contains(weekDayTime);

                if (contains)
                {
                    foundCount++;
                    windowsSinceLast = 0;
                }

                if (foundCount > 0 && !contains)
                {
                    windowsCount++;
                    windowsSinceLast++;
                }
            }
            result += windowsCount - windowsSinceLast;
        }

        return result;
    }

    public int ClassFrontWindows()
    {
        var result = 0;

        foreach (var @class in this.studyGroups)
        {
            var timetableHashSet = @class.GetTimetableHashSet();
            var weekDayNumberIndex = 0;
            var weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
            var firstFound = false;

            foreach (var weekDayTime in this.weekDayTimes)
            {
                if ((weekDayTime - weekDayNumber) > 100)
                {
                    weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
                    firstFound = false;
                }

                if (firstFound)
                {
                    continue;
                }

                if (timetableHashSet.Contains(weekDayTime))
                {
                    firstFound = true;
                    result += weekDayTime - weekDayNumber - 1;
                }
            }
        }

        return result;
    }

    public int ClassWindowsAndFrontWindowsFitness()
    {
        var classWindows = 0;
        var classFrontWindows = 0;

        foreach (var @class in this.studyGroups)
        {
            var timetableHashSet = @class.GetTimetableHashSet();
            var weekDayNumberIndex = 0;
            var weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
            var foundCount = 0;
            var windowsCount = 0;
            var windowsSinceLast = 0;

            foreach (var weekDayTime in this.weekDayTimes)
            {
                if ((weekDayTime - weekDayNumber) > 100)
                {
                    weekDayNumber = this.weekDayNumbers[weekDayNumberIndex++];
                    classWindows += windowsCount - windowsSinceLast;
                    foundCount = 0;
                    windowsCount = 0;
                    windowsSinceLast = 0;
                }

                var contains = timetableHashSet.Contains(weekDayTime);

                if (contains)
                {
                    foundCount++;
                    if (foundCount == 1)
                    {
                        classFrontWindows += weekDayTime - weekDayNumber - 1;
                    }

                    windowsSinceLast = 0;
                }

                if (foundCount > 0 && !contains)
                {
                    windowsCount++;
                    windowsSinceLast++;
                }
            }
            classWindows += windowsCount - windowsSinceLast;
        }

        return (classWindows * this.studyGroupWindowPenalty) + (classFrontWindows * this.studyGroupFrontWindowPenalty);
    }

    private void CheckTimetableSet()
    {
        if (this.timetable == null)
        {
            throw new Exception("Timetable is not set");
        }
    }

    void IFitnessCalculator.Commit()
    {
    }

    void IFitnessCalculator.Rollback()
    {
    }
}
