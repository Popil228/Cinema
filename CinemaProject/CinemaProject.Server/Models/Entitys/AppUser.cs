using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
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

        public enum UserRole
        {
            Admin = 1,
            Customer = 2
        }

        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; } 

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
