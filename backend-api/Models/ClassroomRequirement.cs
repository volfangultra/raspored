namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ClassroomRequirement
{
    [Key]
    public int Id { get; set; }

    public int ClassroomId { get; set; }

    public int RequirementId { get; set; }

    [ForeignKey("RequirementId")]
    public Requirement Requirement { get; set; }

    [ForeignKey("ClassroomId")]
    public Classroom Classroom { get; set; }
    
}
