namespace ProjectNamespace.Models;

public class Penalties
{
    public int ProfessorCollisionPenalty { get; set; }

    public int ProfessorWindowPenalty { get; set; }

    public int StudyGroupCollisionPenalty { get; set; }

    public int StudyGroupWindowPenalty { get; set; }

    public int StudyGroupFrontWindowPenalty { get; set; }

    public static Penalties DefaultPenalties() => new()
    {
        ProfessorCollisionPenalty = 100,
        ProfessorWindowPenalty = 4,
        StudyGroupCollisionPenalty = 100,
        StudyGroupWindowPenalty = 4,
        StudyGroupFrontWindowPenalty = 1,
    };
}
