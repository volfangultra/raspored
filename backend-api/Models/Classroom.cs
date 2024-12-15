namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Classroom
{
    [Key]
    public int Id { get; set; }

    public required string Name { get; set; }

    public required int Capacity { get; set; }

    public bool have_pcs { get; set; }

    public ICollection<ClassroomTimeslot> ClassroomTimeslots { get; set; }

}
