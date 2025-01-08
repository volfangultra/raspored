namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class ProfessorAvailability
{
    [Key]
    public int Id { get; set; }

    public int ProfessorId { get; set; }

    public int Day { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    [ForeignKey("ProfessorId")]
    [JsonIgnore]
    public Professor Professor { get; set; }

}
