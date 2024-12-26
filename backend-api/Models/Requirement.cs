namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Requirement
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<CourseRequirement> CourseRequirements { get; set; }

    public ICollection<ClassroomRequirement> ClassroomRequirements { get; set; }
    
}
