namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ClassroomTimeslot
{
    [Key]
    public int Id { get; set; }

    public int ClassroomId { get; set; }

    public int TimeslotId { get; set; }

    public bool Reserved { get; set; }

    [ForeignKey("ClassroomId")]
    public Classroom Classroom { get; set; }

    [ForeignKey("TimeslotId")]
    public Timeslot Timeslot { get; set; }
    
}
