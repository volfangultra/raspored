namespace ProjectNamespace.Mutators;
using ProjectNamespace.Models;
using ProjectNamespace.Mutations;

public class Mutator : IMutator
{
    private List<IMutation> mutations;
    private Timetable timetable;
    private Random random;
    private List<MutationHistory> pendingChanges;
    private Dictionary<int, LessonAlgo> lessonGroups;

    public Mutator(List<IMutation> mutations) : this(mutations, new Random()) { }

    public Mutator(List<IMutation> mutations, Random random)
    {
        this.mutations = mutations;
        this.random = random;
        this.pendingChanges = new List<MutationHistory>();

    }

    public void SetTimetable(Timetable timetable)
    {
        this.timetable = timetable;
        this.lessonGroups = timetable.Lessons.ToDictionary(x => x.Id);
    }

    public List<int> Mutate()
    {
        if (this.timetable == null)
        {
            throw new Exception("Timetable is not set");
        }

        if (this.pendingChanges.Count > 0)
        {
            throw new Exception("Commit or rollback changes before mutation");
        }

        var result = new List<int>();
        var randomMutationIndex = this.random.Next(0, this.mutations.Count);
        var randomMutation = this.mutations[randomMutationIndex];
        this.pendingChanges.AddRange(randomMutation.Mutate(this.timetable.Lessons, this.timetable.Timeslots, this.random));
        return this.pendingChanges.Select(s => s.IdLesson).ToList();
    }

    public void Commit() => this.pendingChanges.Clear();

    public void Rollback()
    {
        for (var i = this.pendingChanges.Count - 1; i >= 0; i--)
        {
            var changeHistoryElement = this.pendingChanges[i];
            var teachingGroup = this.lessonGroups[changeHistoryElement.IdLesson];
            teachingGroup.ChangeDayTime(changeHistoryElement.NewValue, changeHistoryElement.OldValue);
        }

        this.pendingChanges.Clear();
    }
}
