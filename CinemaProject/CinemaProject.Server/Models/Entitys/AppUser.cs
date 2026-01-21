using CinemaProject.Server.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Server.Models.Entitys
{
    public class AppUser
    {
        public int AppUserId { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string Email { get; set; } = null!;

        [Column(TypeName = "varchar(15)")]
        public string PhoneNum { get; set; } = null!;

        [Column(TypeName = "varchar(255)")]
        public string PasswordHash { get; set; } = null!;

        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
