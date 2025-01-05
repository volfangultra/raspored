namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Lesson 
{
    [Key]
    public int Id { get; set; }
    public int CourseId { get; set; }

    public int ClassroomId { get; set; }

    public int Day { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    [ForeignKey("ClassroomId")]
    public Classroom Classroom { get; set; }
    
}
