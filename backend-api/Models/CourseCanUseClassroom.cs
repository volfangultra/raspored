namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseCanUseClassroom
{
    [Key]
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int ClassroomId { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    [ForeignKey("ClassroomId")]
    public Classroom Classroom { get; set; }
}
