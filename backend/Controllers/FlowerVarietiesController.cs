using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FlowerVarietiesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FlowerVarietiesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.FlowerVarieties.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var variety = await _db.FlowerVarieties.FindAsync(id);
        if (variety == null)
        {
            return NotFound();
        }
        return Ok(variety);
    }

    [HttpPost]
    [Authorize(Roles = "Editor")]
    public async Task<IActionResult> Create(FlowerVariety variety)
    {
        _db.FlowerVarieties.Add(variety);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = variety.Id }, variety);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Editor")]
    public async Task<IActionResult> Update(int id, FlowerVariety variety)
    {
        if (id != variety.Id)
        {
            return BadRequest();
        }

        var existing = await _db.FlowerVarieties.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        existing.Name = variety.Name;
        existing.Color = variety.Color;
        existing.Price = variety.Price;
        existing.InStock = variety.InStock;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Editor")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.FlowerVarieties.FindAsync(id);
        if (existing == null)
        {
            return NotFound();
        }

        _db.FlowerVarieties.Remove(existing);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
