using LegalAccounting.API.Data;
using LegalAccounting.API.DTOs.Contact;
using LegalAccounting.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
private readonly AppDbContext _context;

public ContactController(AppDbContext context)
{
    _context = context;
}

// POST: /api/contact
[AllowAnonymous]
[HttpPost]
public async Task<IActionResult> SendMessage(
    [FromBody] ContactDto dto)
{
    if (!ModelState.IsValid)
    {
        return ValidationProblem(ModelState);
    }

    var contactMessage = new ContactMessage
    {
        Name = dto.Name.Trim(),
        Email = dto.Email.Trim(),
        Subject = dto.Subject.Trim(),
        Message = dto.Message.Trim(),
        CreatedAt = DateTime.UtcNow,
        IsRead = false
    };

    _context.ContactMessages.Add(contactMessage);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Your message has been received successfully.",
        id = contactMessage.Id
    });
}

}
