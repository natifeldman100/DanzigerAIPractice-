using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<FlowerVariety> FlowerVarieties { get; set; }
    

    public DbSet<Customer> Customers { get; set; }
  
   
}

