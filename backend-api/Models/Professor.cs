namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Professor
{
    [Key]
    public required int Id { get; set; }

    public required string Name { get; set; }

    public required string Rank { get; set; }

    public ICollection<ProfessorTimeslot> ProfessorTimeslots { get; set; }
    
    public ICollection<Lesson> Lessons { get; set; }

}
