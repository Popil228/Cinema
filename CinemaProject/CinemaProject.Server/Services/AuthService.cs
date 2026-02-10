using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Auth;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Entitys;
using CinemaProject.Server.Models.Enums;
using CinemaProject.Server.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Memory;

namespace CinemaProject.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly CinemaDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        public AuthService(CinemaDbContext context, IConfiguration configuration, IMemoryCache cache, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _cache = cache;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            //Перевірка чи існує користувач з таким email
            if (await _context.AppUsers.AnyAsync(u => u.Email == request.Email))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Користувач з таким email вже існує"
                };
            }

            //Перевірка чи існує користувач з таким номером телефону
            if (await _context.AppUsers.AnyAsync(u => u.PhoneNum == request.PhoneNum))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Користувач з таким номером телефону вже існуєє"
                };
            }

            // Створюємо об'єкт користувача, але НЕ додаємо в _context
            var user = new AppUser
            {
                Email = request.Email,
                PhoneNum = request.PhoneNum,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Зберігаємо дані користувача в кеш на 30 хвилин
            var cacheOptions = new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
            _cache.Set($"temp_user_data_{request.Email}", user, cacheOptions);

            // Генеруємо та відправляємо код
            await ResendConfirmationCodeAsync(user.Email);

            return new AuthResponse
            {
                Success = true,
                Message = "Код підтвердження надіслано на вашу пошту. Будь ласка, введіть його для завершення реєстрації."
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            //Пошук користувача за email
            var user = await _context.AppUsers
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Невірний email або пароль"
                };
            }

            // Перевірка чи активний користувач....
            if (!user.IsActive)
            {
                return new AuthResponse { Success = false, Message = "Обліковий запис деактивовано" };
            }

            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Success = true,
                Message = "Вхід успішний",
                Token = token,
                User = MapToUserDto(user)
            };
        }

        public async Task<AuthResponse> ConfirmEmailAsync(ConfirmEmailRequest request)
        {
            if (_cache.TryGetValue($"confirm_{request.Email}", out string savedCode))
            {
                if (savedCode == request.Code)
                {
                    // Якщо код вірний, дістаємо дані користувача, які ми "відклали" раніше
                    if (_cache.TryGetValue($"temp_user_data_{request.Email}", out AppUser tempUser))
                    {
                        // Тільки зараз додаємо користувача в реальну базу даних
                        _context.AppUsers.Add(tempUser);
                        await _context.SaveChangesAsync();

                        // Очищуємо кеш
                        _cache.Remove($"confirm_{request.Email}");
                        _cache.Remove($"temp_user_data_{request.Email}");

                        return new AuthResponse { Success = true, Message = "Реєстрація завершена! Тепер ви можете увійти." };
                    }
                    else
                    {
                        return new AuthResponse { Success = false, Message = "Час реєстрації вичерпано. Будь ласка, спробуйте зареєструватися знову." };
                    }
                }
            }

            return new AuthResponse { Success = false, Message = "Невірний або застарілий код підтвердження" };
        }

        public async Task<AuthResponse> ResendConfirmationCodeAsync(string email)
        {
            if (!_cache.TryGetValue($"temp_user_data_{email}", out _))
            {
                return new AuthResponse { Success = false, Message = "Дані реєстрації не знайдено. Почніть спочатку." };
            }

            var code = new Random().Next(100000, 999999).ToString();
            _cache.Set($"confirm_{email}", code, TimeSpan.FromMinutes(15));

            var message = $@"
            <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;'>
                <h2 style='color: #2d3748;'>Підтвердження пошти</h2>
                <p>Ваш код для завершення реєстрації в Cinema Hall:</p>
                <div style='font-size: 24px; font-weight: bold; color: #4a5568; letter-spacing: 5px; padding: 10px; background: #f7fafc; display: inline-block;'>
                    {code}
                </div>
                <p style='color: #718096; font-size: 12px; margin-top: 20px;'>Код дійсний протягом 15 хвилин.</p>
            </div>";

            await _emailService.SendEmailAsync(email, "Код підтвердження Cinema Hall", message);

            return new AuthResponse { Success = true, Message = "Код надіслано на вашу пошту" };
        }

        private string GenerateJwtToken(AppUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "60");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AppUserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.MobilePhone, user.PhoneNum),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserDto MapToUserDto(AppUser user)
        {
            return new UserDto
            {
                Id = user.AppUserId,
                Email = user.Email,
                PhoneNum = user.PhoneNum,
                Role = user.Role
            };
        }
    }
}

