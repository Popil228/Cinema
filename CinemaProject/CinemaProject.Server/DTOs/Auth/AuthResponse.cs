using CinemaProject.Server.Models.Enums;

namespace CinemaProject.Server.DTOs.Auth
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? Token { get; set; }
        public UserDto? User { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string PhoneNum { get; set; } = null!;
        public UserRole Role { get; set; }
    }
}
