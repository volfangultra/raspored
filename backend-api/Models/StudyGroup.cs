namespace ProjectNamespace.Models;

public class StudyGroup
{
    public required int Id { get; set; }

    public required string Cycle { get; set; }

    public required string Department { get; set; }

    public required string Program { get; set; }

    public required int Num_of_students { get; set; }
    
}
