using System.Security.Claims;
using LegalAccounting.API.DTOs.Clients;
using LegalAccounting.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/client/dashboard")]
[Authorize(Roles = "Client")]
public class ClientDashboardController : ControllerBase
{
private readonly IClientDashboardService _dashboardService;

public ClientDashboardController(
    IClientDashboardService dashboardService)
{
    _dashboardService = dashboardService;
}

[HttpGet]
public async Task<ActionResult<ClientDashboardDto>> GetDashboard()
{
    var userIdClaim = User.FindFirstValue(
        ClaimTypes.NameIdentifier
    );

    if (!int.TryParse(userIdClaim, out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user token."
        });
    }

    var dashboard = await _dashboardService
        .GetDashboardAsync(userId);

    if (dashboard == null)
    {
        return NotFound(new
        {
            message = "Client profile not found."
        });
    }

    return Ok(dashboard);
}

}
