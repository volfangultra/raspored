namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Professor 
{
    [Key]
    public int Id { get; set; }

    public int ScheduleId { get; set; }

    public string Name { get; set; }
    public string Rank { get; set; }

    [ForeignKey("ScheduleId")]
    public Schedule Schedule { get; set; }

    public ICollection<Course> Courses { get; set; }

    public ICollection<ProfessorAvailability> ProfessorAvailabilities { get; set; }

}