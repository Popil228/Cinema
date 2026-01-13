using Microsoft.AspNetCore.Identity;

namespace CinemaProject.Server.Models.Entitys
{
    public class AppUser
    {
        public int AppUserId { get; set; }
        public string Email { get; set; } = null!;
        public string PhoneNum { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public int RoleId { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }

        public UserRole Role { get; set; } = null!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
