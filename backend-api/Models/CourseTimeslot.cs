namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseTimeslot
{
    [Key]
    public int Id { get; set; }

    public int CourseId { get; set; }

    public int TimeSlotId { get; set; }

    [ForeignKey("TimeSlotId")]
    public Timeslot Timeslot { get; set; }

    [ForeignKey("CourseId")]
    public Course Course { get; set; }
    
}
