using CinemaProject.Server.Models;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Data
{
    public class CinemaDbContext : DbContext
    {
        public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
            : base(options) { }
        
        public DbSet<AppUser> Users { get; set; } = null!;
        public DbSet<UserRole> Roles { get; set; } = null!;
        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<Genre> Genres { get; set; } = null!;
        public DbSet<Hall> Halls { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        public DbSet<Session> Sessions { get; set; } = null!;
        public DbSet<SessionSeat> SessionSeats { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Ticket> Tickets { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Унікальність для користувача
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.PhoneNum).IsUnique();

            // Унікальність крісел у залі
            modelBuilder.Entity<Seat>()
                .HasIndex(s => new { s.HallId, s.RowNumber, s.SeatNumber }).IsUnique();

            // Унікальність місця на конкретному сеансі
            modelBuilder.Entity<SessionSeat>()
                .HasIndex(ss => new { ss.SessionId, ss.SeatId }).IsUnique();

            // Унікальність жанрів для фільму
            modelBuilder.Entity<MovieGenre>()
                .HasIndex(mg => new { mg.MovieId, mg.GenreId }).IsUnique();

            // Налаштування грошових типів
            modelBuilder.Entity<Session>()
                .Property(s => s.BasePrice).HasPrecision(18, 2);
            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<Ticket>()
                .Property(t => t.Price).HasPrecision(18, 2);

            // Налагодження каскадного видалення для сеансів та сеанс-місць
            modelBuilder.Entity<SessionSeat>()
                .HasOne(ss => ss.Session)
                .WithMany(s => s.SessionSeats)
                .HasForeignKey(ss => ss.SessionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Налагодження каскадного видалення для квитків та сеанс-місць
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.SessionSeat)
                .WithMany()
                .HasForeignKey(t => t.SessionSeatId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }

    }
}
