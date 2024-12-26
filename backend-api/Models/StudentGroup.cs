namespace ProjectNamespace.Models;

public class StudentGroup
{
    public int Id { get; set; }

    public string Major { get; set; }

    public int Year {get; set; }

    public string Name { get; set; }

    public ICollection<GroupTakesCourse> GroupTakesCourses { get; set; }

}
