namespace ProjectNamespace.Mutations;
using ProjectNamespace.Models;

public interface IMutation
{
    List<MutationHistory> Mutate(List<LessonAlgo> lessonGroups, List<KeyValuePair<short, short>> timeslots, Random random = null);
}
