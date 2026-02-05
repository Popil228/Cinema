using CinemaProject.Server.Models;
using CinemaProject.Server.Models.Entitys;
using Microsoft.EntityFrameworkCore;

namespace CinemaProject.Server.Data
{
    public class CinemaDbContext : DbContext
    {
        public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
            : base(options) { }
        
        public DbSet<AppUser> AppUsers { get; set; } = null!;
        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<Genre> Genres { get; set; } = null!;
        public DbSet<MovieGenre> MovieGenres { get; set; } = null!;
        public DbSet<Actor> Actors { get; set; } = null!;
        public DbSet<MovieActor> MovieActors { get; set; } = null!;
        public DbSet<Hall> Halls { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        public DbSet<SeatType> SeatTypes { get; set; } = null!;
        public DbSet<Session> Sessions { get; set; } = null!;
        public DbSet<SessionSeat> SessionSeats { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Ticket> Tickets { get; set; } = null!;
        public DbSet<Discount> Discounts { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Унікальність для користувача
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.PhoneNum).IsUnique();

            // Унікальність квитка для сеанс-місця
            //modelBuilder.Entity<Ticket>().HasIndex(t => t.SessionSeatId).IsUnique();

            // Унікальність крісел у залі
            modelBuilder.Entity<Seat>()
                .HasIndex(s => new { s.HallId, s.RowNumber, s.SeatNumber }).IsUnique();

            // Унікальність місця на конкретному сеансі
            modelBuilder.Entity<SessionSeat>()
                .HasIndex(ss => new { ss.SessionId, ss.SeatId }).IsUnique();

            // Унікальність жанрів для фільму
            modelBuilder.Entity<MovieGenre>()
                .HasKey(mg => new { mg.MovieId, mg.GenreId });

            // Унікальність акторів для фільму
            modelBuilder.Entity<MovieActor>()
                .HasKey(ma => new { ma.MovieId, ma.ActorId });

            // Унікальність кодів знижок
            modelBuilder.Entity<Discount>().HasIndex(d => d.Code).IsUnique();

            // Налаштування грошових типів
            modelBuilder.Entity<Session>()
                .Property(s => s.BasePrice).HasPrecision(6, 2);
            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalPrice).HasPrecision(6, 2);
            modelBuilder.Entity<Ticket>()
                .Property(t => t.Price).HasPrecision(6, 2);

            // Налагодження заборони на видалення для крісел та типів крісел
            modelBuilder.Entity<Seat>()
                .HasOne(s => s.SeatType)
                .WithMany(st => st.Seats) 
                .HasForeignKey(s => s.SeatTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Налагодження каскадного видалення для сеансів та сеанс-місць
            modelBuilder.Entity<SessionSeat>()
                .HasOne(ss => ss.Session)
                .WithMany(s => s.SessionSeats)
                .HasForeignKey(ss => ss.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для квитків та сеанс-місць
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.SessionSeat)
                .WithOne(ss => ss.Ticket)
                .HasForeignKey<Ticket>(t => t.SessionSeatId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження заборони на видалення для знижок та бронювань
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Discount)
                .WithMany(d => d.Bookings)
                .HasForeignKey(b => b.DiscountId)
                .OnDelete(DeleteBehavior.Restrict);

            // Налагодження каскадного видалення для бронювань та квитків
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Booking)
                .WithMany(b => b.Tickets)
                .HasForeignKey(t => t.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для користувачів та бронювань
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.AppUser)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для фільмів та сеансів
            modelBuilder.Entity<Session>()
                .HasOne(s => s.Movie)
                .WithMany(m => m.Sessions)
                .HasForeignKey(s => s.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для залів та крісел
            modelBuilder.Entity<Seat>()
                .HasOne(s => s.Hall)
                .WithMany(h => h.Seats)
                .HasForeignKey(s => s.HallId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для мість та сенсів-місць
            modelBuilder.Entity<SessionSeat>()
                .HasOne(ss => ss.Seat)
                .WithMany(s => s.SessionSeats)
                .HasForeignKey(ss => ss.SeatId)
                .OnDelete(DeleteBehavior.Cascade);

            // Налагодження каскадного видалення для залу та сеансів
            modelBuilder.Entity<Session>()
                .HasOne(s => s.Hall)
                .WithMany(h => h.Sessions)
                .HasForeignKey(s => s.HallId)
                .OnDelete(DeleteBehavior.Cascade);



            // Ініціалізація типів місць
            modelBuilder.Entity<SeatType>().HasData(
                new SeatType { SeatTypeId = 1, Type = "Standard", PricePercent = 100 },
                new SeatType { SeatTypeId = 2, Type = "VIP", PricePercent = 150 }
            );

            // Ініціалізація залів
            modelBuilder.Entity<Hall>().HasData(
                new Hall { HallId = 1, Name = "Зал A" },
                new Hall { HallId = 2, Name = "Зал B" }
            );

            // Ініціалізація місць для кожного залу
            var seats = new List<Seat>();
            for (int hallId = 1; hallId <= 2; hallId++)
            {
                for (short row = 1; row <= 5; row++)
                {
                    for (short seatNum = 1; seatNum <= 10; seatNum++)
                    {
                        int seatTypeId;
                        if (row <= 3) seatTypeId = 1; // Standard - перші 3 ряди
                        else seatTypeId = 2; // VIP - останні 2 ряди

                        seats.Add(new Seat
                        {
                            SeatId = (hallId - 1) * 50 + (row - 1) * 10 + seatNum,
                            HallId = hallId,
                            RowNumber = row,
                            SeatNumber = seatNum,
                            SeatTypeId = seatTypeId
                        });
                    }
                }
            }
            modelBuilder.Entity<Seat>().HasData(seats);

            base.OnModelCreating(modelBuilder);
        }

    }
}
