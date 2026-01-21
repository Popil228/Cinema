using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Server.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email є обов'язковим")]
        [EmailAddress(ErrorMessage = "Невірний формат email")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Пароль є обов'язковим")]
        public string Password { get; set; } = null!;
    }
}
