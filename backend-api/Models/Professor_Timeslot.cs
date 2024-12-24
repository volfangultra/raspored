namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProfessorTimeslot
{
    [Key]
    public int Id { get; set; }

    public int ProfessorId { get; set; }

    public int TimeslotId { get; set; }

    [ForeignKey("ClassroomId")]
    public Professor Professor { get; set; }

    [ForeignKey("TimeslotId")]
    public Timeslot Timeslot { get; set; }

    public ICollection<Lesson> Lessons { get; set; }
    
}
