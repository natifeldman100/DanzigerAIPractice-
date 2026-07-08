using System.ComponentModel.DataAnnotations;

public class Supplier
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? ContactPerson { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
}