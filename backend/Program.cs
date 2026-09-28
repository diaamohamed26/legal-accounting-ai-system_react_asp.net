using System.Text;
using LegalAccounting.API.Data;
using LegalAccounting.API.Services;
using LegalAccounting.API.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// Controllers
// =====================================================

builder.Services.AddControllers();

// =====================================================
// Database
// =====================================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// =====================================================
// Application Services
// =====================================================

// Authentication
builder.Services.AddScoped<IAuthService, AuthService>();

// Client Dashboard
builder.Services.AddScoped<
    IClientDashboardService,
    ClientDashboardService
>();

// Public Dashboard
builder.Services.AddScoped<
    IPublicDashboardService,
    PublicDashboardService
>();

// Invoice
builder.Services.AddScoped<InvoiceService>();

// Documents
builder.Services.AddScoped<
    IDocumentService,
    DocumentService
>();

// AI Assistant
builder.Services.AddScoped<
    IAiAssistantService,
    AiAssistantService
>();

// =====================================================
// JWT Authentication
// =====================================================

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT Key is missing."
    );

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT Issuer is missing."
    );

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT Audience is missing."
    );

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    ),

                RoleClaimType =
                    System.Security.Claims.ClaimTypes.Role,

                NameClaimType =
                    System.Security.Claims.ClaimTypes.NameIdentifier
            };
    });

// =====================================================
// Authorization
// =====================================================

builder.Services.AddAuthorization();

// =====================================================
// CORS
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =====================================================
// Build
// =====================================================

var app = builder.Build();

// =====================================================
// Static Files
// =====================================================

app.UseStaticFiles();

// =====================================================
// Middleware
// =====================================================

// CORS must run before Authentication / Authorization
app.UseCors("Frontend");

app.UseAuthentication();

app.UseAuthorization();

// =====================================================
// Controllers
// =====================================================

app.MapControllers();

// =====================================================
// Database Seed
// =====================================================

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await DbInitializer.SeedAsync(context);
}

// =====================================================
// Run
// =====================================================

app.Run();