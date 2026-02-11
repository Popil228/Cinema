using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Server.DTOs.Auth
{
    public class ConfirmEmailRequest
    {
        [Required(ErrorMessage = "Email є обов'язковим")]
        [EmailAddress(ErrorMessage = "Невірний формат email")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Код підтвердження є обов'язковим")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Код має містити 6 цифр")]
        public string Code { get; set; } = null!;
    }
}