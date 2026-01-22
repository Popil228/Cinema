using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Server.DTOs.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Email є обов'язковим ")]
        [EmailAddress(ErrorMessage = "Невірний формат email ")]
        [MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Номер телефону є обов'язковим ")]
        [Phone(ErrorMessage = "Невірний формат номера телефону")]
        [MaxLength(15)]
        public string PhoneNum { get; set; } = null!;

        [Required(ErrorMessage = "Пароль є обов'язковим ")]
        [MinLength(6, ErrorMessage = "Пароль має містити мінімум 6 символів")]
        [MaxLength(100)]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Підтвердження паролю є обов'язковим")]
        [Compare("Password", ErrorMessage = "Паролі не співпадають")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
