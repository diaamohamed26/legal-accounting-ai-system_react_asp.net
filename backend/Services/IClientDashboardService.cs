using LegalAccounting.API.DTOs.Clients;

namespace LegalAccounting.API.Services;

public interface IClientDashboardService
{
Task<ClientDashboardDto?> GetDashboardAsync(int userId);
}
