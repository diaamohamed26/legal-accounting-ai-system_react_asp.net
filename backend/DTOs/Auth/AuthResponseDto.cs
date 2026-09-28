namespace LegalAccounting.API.DTOs.Auth;

public class AuthResponseDto
{
public string Token { get; set; } = string.Empty;

public UserResponseDto User { get; set; } = new();

}

public class UserResponseDto
{
public int Id { get; set; }

public string Name { get; set; } = string.Empty;

public string Email { get; set; } = string.Empty;

public string Role { get; set; } = string.Empty;

}
