namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class StudyGroup
{
    [Key]
    public required int Id { get; set; }

    public required string Cycle { get; set; }

    public required string Department { get; set; }

    public required string Program { get; set; }

    public required int NumOfStudents { get; set; }

    public ICollection<Lesson> Lessons { get; set; }
    
}
