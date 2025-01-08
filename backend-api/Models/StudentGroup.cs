namespace ProjectNamespace.Models;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class StudentGroup
{
    public int Id { get; set; }

    public int ScheduleId { get; set; }

    public string Major { get; set; }

    public int Year { get; set; }

    public string Name { get; set; }

    [ForeignKey("ScheduleId")]
    public Schedule Schedule { get; set; }

    public ICollection<GroupTakesCourses> GroupTakesCourses { get; set; }

}
