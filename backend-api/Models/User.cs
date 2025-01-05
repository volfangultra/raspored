namespace ProjectNamespace.Models;

using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; }
    public string Email {get; set; }

    public string PasswordHash { get; set; }

    public string College { get; set; }

    public string Role { get; set; }
    [JsonIgnore]
    public ICollection<Schedule> Schedules { get; set; }
}
