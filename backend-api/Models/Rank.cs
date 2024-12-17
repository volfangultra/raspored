namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Lesson
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<Professor> Professors { get; set; }
    
}
