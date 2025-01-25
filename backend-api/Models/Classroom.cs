namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Classroom
{
    [Key]
    public int Id { get; set; }

    public int ScheduleId { get; set; }

    public string Name { get; set; }

    public int Floor { get; set; }

    public int Capacity { get; set; }

    [ForeignKey("ScheduleId")]
    public Schedule Schedule { get; set; }

    public ICollection<CourseCanNotUseClassroom> CourseCanNotUseClassrooms { get; set; }

    public ICollection<Lesson> Lessons { get; set; }

}
