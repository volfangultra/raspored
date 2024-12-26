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

    public int NumberOfSlots { get; set; }

    [ForeignKey("ScheduleId")]
    public Schedule Schedule { get; set; }
    
    [ForeignKey("ProfessorId")]
    public Professor Professor { get; set; }

    public ICollection<CourseCanUseClassroom> CourseCanUseClassrooms { get; set; }

    public ICollection<GroupTakesCourse> GroupTakesCourses { get; set; }
}
