using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Server.DTOs.Auth
{
    public class ResendCodeRequest
    {
        [Required(ErrorMessage = "Email є обов'язковим")]
        [EmailAddress(ErrorMessage = "Невірний формат email")]
        public string Email { get; set; } = null!;
    }
}