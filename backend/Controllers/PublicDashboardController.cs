using LegalAccounting.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LegalAccounting.API.Controllers;

[ApiController]
[Route("api/public/dashboard")]
public class PublicDashboardController : ControllerBase
{
private readonly IPublicDashboardService _dashboardService;

public PublicDashboardController(
    IPublicDashboardService dashboardService)
{
    _dashboardService = dashboardService;
}

[AllowAnonymous]
[HttpGet("summary")]
public async Task<ActionResult<PublicDashboardSummaryDto>> GetSummary()
{
    var summary = await _dashboardService.GetSummaryAsync();

    return Ok(summary);
}

}
