namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Schedule
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; }

    public string Semester { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public ICollection<Course> Courses { get; set; }

    public ICollection<Classroom> Classrooms { get; set; }
    
}
