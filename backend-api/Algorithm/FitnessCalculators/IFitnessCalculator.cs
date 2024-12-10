namespace ProjectNamespace.FitnessCalculators;
using ProjectNamespace.Models;

public interface IFitnessCalculator
{
    void SetTimetable(Timetable timetable);

    int GetFitness(List<int> modifiedTeachingGroups);

    void Commit();

    void Rollback();
}
