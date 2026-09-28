using LegalAccounting.API.DTOs.Auth;

namespace LegalAccounting.API.Services;

public interface IAuthService
{
Task<AuthResponseDto?> LoginAsync(LoginDto dto);

Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);

}
