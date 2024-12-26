namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProfessorAvailability
{
    [Key]
    public int Id { get; set; }

    public string ProfessorId { get; set; }

    public int Day { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly Endtime { get; set; }

    [ForeignKey("ProfessorId")]
    public Professor Professor { get; set; }
    
}