namespace ProjectNamespace.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Professor
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public int RankId { get; set; }

    [ForeignKey("RankId")]
    public Rank Rank { get; set; }

    public ICollection<Course> Courses { get; set; }

}
