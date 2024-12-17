namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Timeslot
{
    [Key]
    public required int Id { get; set; }

    public string Day { get; set; }
    
    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public ICollection<ClassroomTimeslot> ClassroomTimeslots { get; set; }

    public ICollection<CourseTimeslot> CourseTimeslots { get; set; }
    
}
