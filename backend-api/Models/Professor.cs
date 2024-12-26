namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;

public class Professor 
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public string Rank { get; set; }

    public int NumberOfSlots { get; set; }

    public ICollection<Course> Courses { get; set; }

    public ICollection<ProfessorAvailability> ProfessorAvailabilities { get; set; }

}