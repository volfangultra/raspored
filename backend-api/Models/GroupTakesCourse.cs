namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class GroupTakesCourse
{
    [Key]
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int StudentGroupId { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }

    [ForeignKey("GroupId")]
    public StudentGroup StudentGroup { get; set; }
}