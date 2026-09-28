using System.ComponentModel.DataAnnotations;

namespace LegalAccounting.API.DTOs.Contact;

public class ContactDto
{
[Required]
[MaxLength(100)]
public string Name { get; set; } = string.Empty;

[Required]
[EmailAddress]
[MaxLength(150)]
public string Email { get; set; } = string.Empty;

[Required]
[MaxLength(200)]
public string Subject { get; set; } = string.Empty;

[Required]
[MaxLength(5000)]
public string Message { get; set; } = string.Empty;

}
