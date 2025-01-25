namespace ProjectNamespace.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Course
{
    [Key]
    public int Id { get; set; }

    public int ScheduleId { get; set; }

    public int ProfessorId { get; set; }

    public string Name { get; set; }

    public string Type { get; set; }

    public int LectureSlotLength { get; set; }

    [ForeignKey("ScheduleId")]
    public Schedule Schedule { get; set; }

    [ForeignKey("ProfessorId")]
    public Professor Professor { get; set; }

    public ICollection<CourseCanNotUseClassroom> CourseCanNotUseClassrooms { get; set; }

    public ICollection<GroupTakesCourses> GroupTakesCourses { get; set; }

    public ICollection<Lesson> Lessons { get; set; }
}
