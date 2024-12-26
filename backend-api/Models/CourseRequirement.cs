namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseRequirement
{
    [Key]
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int RequirementId { get; set; }

    [ForeignKey("RequirementId")]
    public Requirement Requirement { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }
    
}
