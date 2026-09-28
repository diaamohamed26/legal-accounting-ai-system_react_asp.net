using LegalAccounting.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LegalAccounting.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // =========================================================
    // DBSETS
    // =========================================================

    public DbSet<User> Users => Set<User>();

    public DbSet<Client> Clients => Set<Client>();

    public DbSet<Invoice> Invoices => Set<Invoice>();

    public DbSet<Expense> Expenses => Set<Expense>();

    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<Document> Documents => Set<Document>();

    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        // =========================================================
        // USER
        // =========================================================

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.Name)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(u => u.Email)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(u => u.PasswordHash)
                .IsRequired();

            entity.Property(u => u.Role)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Property(u => u.IsActive)
                .HasDefaultValue(true);

            entity.Property(u => u.CreatedAt)
                .IsRequired();
        });


        // =========================================================
        // CLIENT
        // =========================================================

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(c => c.Email)
                .HasMaxLength(150)
                .IsRequired();

            // One User -> One Client
            entity.HasIndex(c => c.UserId)
                .IsUnique();

            // Client -> User
            entity.HasOne(c => c.User)
                .WithOne()
                .HasForeignKey<Client>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // CLIENT -> INVOICES
            // =====================================================

            entity.HasMany(c => c.Invoices)
                .WithOne(i => i.Client)
                .HasForeignKey(i => i.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // CLIENT -> EXPENSES
            // =====================================================

            entity.HasMany(c => c.Expenses)
                .WithOne(e => e.Client)
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // CLIENT -> TRANSACTIONS
            // =====================================================

            entity.HasMany(c => c.Transactions)
                .WithOne(t => t.Client)
                .HasForeignKey(t => t.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            // =====================================================
            // CLIENT -> DOCUMENTS
            // =====================================================

            entity.HasMany(c => c.Documents)
                .WithOne(d => d.Client)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        // =========================================================
        // INVOICE
        // =========================================================

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(i => i.Id);

            // -----------------------------------------------------
            // Client relationship
            // -----------------------------------------------------

            entity.HasIndex(i => i.ClientId);

            entity.HasOne(i => i.Client)
                .WithMany(c => c.Invoices)
                .HasForeignKey(i => i.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            // -----------------------------------------------------
            // Invoice Number
            // -----------------------------------------------------

            entity.Property(i => i.InvoiceNumber)
                .HasMaxLength(100)
                .IsRequired();

            // Every invoice should have a unique invoice number
            entity.HasIndex(i => i.InvoiceNumber)
                .IsUnique();

            // -----------------------------------------------------
            // Amount
            // -----------------------------------------------------

            entity.Property(i => i.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            // -----------------------------------------------------
            // Status
            // -----------------------------------------------------

            entity.Property(i => i.Status)
                .HasMaxLength(50)
                .IsRequired();

            // -----------------------------------------------------
            // Dates
            // -----------------------------------------------------

            entity.Property(i => i.Date)
                .IsRequired();

            entity.Property(i => i.DueDate)
                .IsRequired();
        });


        // =========================================================
        // EXPENSE
        // =========================================================

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);

            // -----------------------------------------------------
            // Client relationship
            // -----------------------------------------------------

            entity.HasIndex(e => e.ClientId);

            entity.HasOne(e => e.Client)
                .WithMany(c => c.Expenses)
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            // -----------------------------------------------------
            // Description
            // -----------------------------------------------------

            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsRequired();

            // -----------------------------------------------------
            // Amount
            // -----------------------------------------------------

            entity.Property(e => e.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            // -----------------------------------------------------
            // Date
            // -----------------------------------------------------

            entity.Property(e => e.Date)
                .IsRequired();

            // -----------------------------------------------------
            // Category
            // -----------------------------------------------------

            entity.Property(e => e.Category)
                .HasMaxLength(100);

            // -----------------------------------------------------
            // Notes
            // -----------------------------------------------------

            entity.Property(e => e.Notes)
                .HasMaxLength(1000);
        });


        // =========================================================
        // TRANSACTION
        // =========================================================

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.HasIndex(t => t.ClientId);

            entity.Property(t => t.Description)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(t => t.Amount)
                .HasPrecision(18, 2)
                .IsRequired();

            entity.Property(t => t.Type)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(t => t.Date)
                .IsRequired();
        });


        // =========================================================
        // DOCUMENT
        // =========================================================

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.HasIndex(d => d.ClientId);
        });


        // =========================================================
        // CONTACT MESSAGE
        // =========================================================

        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                .HasMaxLength(100);

            entity.Property(c => c.Email)
                .HasMaxLength(150);

            entity.Property(c => c.Subject)
                .HasMaxLength(200);

            entity.Property(c => c.Message)
                .HasMaxLength(5000);

            entity.Property(c => c.CreatedAt)
                .IsRequired();

            entity.Property(c => c.IsRead)
                .HasDefaultValue(false);
        });
    }
}