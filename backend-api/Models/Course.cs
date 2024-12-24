namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Course
{
    [Key]
    public int Id { get; set; }

    public int ProfessorId { get; set; }

    public string Name { get; set; }

    public int LectureSlotLength { get; set; }

    [ForeignKey("ProfessorId")]
    public Professor Professor { get; set; }

    public ICollection<CourseRequirement> CourseRequirements { get; set; }
    public ICollection<CourseTimeslot> CourseTimeslots { get; set; }
    public ICollection<Lesson> Lessons { get; set; }
    
}
