namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Lesson
{
    [Key]
    public int Id { get; set; }
    
    public string Course { get; set; }
    
    public int ProfessorId { get; set; }

    public int ClassroomTimeslotId { get; set; }
    
    public int StudyGroupId { get; set; }
    
    public string Type { get; set; }

    [ForeignKey("ProfessorId")]
    public Professor Professor { get; set; }
    
    [ForeignKey("ClassroomTimeslotId")]
    public ClassroomTimeslot ClassroomTimeslot { get; set; }
    
    [ForeignKey("StudyGroupId")]
    public StudyGroup StudyGroup { get; set; }
    
}
