namespace ProjectNamespace.Mutators;
using ProjectNamespace.Models;

public interface IMutator
{
    void SetTimetable(Timetable timetable);

    List<int> Mutate();

    void Commit();

    void Rollback();
}
