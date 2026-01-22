using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CinemaProject.Server.Data;
using CinemaProject.Server.DTOs.Auth;
using CinemaProject.Server.Models.Entitys;
using CinemaProject.Server.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CinemaProject.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly CinemaDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(CinemaDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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

            //Створення нового користувача
            var user = new AppUser
            {
                Email = request.Email,
                PhoneNum = request.PhoneNum,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();

            //Генерація JWT токена
            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Success = true,
                Message = "Реєстрація успішна",
                Token = token,
                User = MapToUserDto(user)
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            //Пошук користувача за email
            var user = await _context.AppUsers
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
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
                return new AuthResponse
                {
                    Success = false,
                    Message = "Обліковий запис деактивовано"
                };
            }

            //Перевірка паролю
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Невірний email або пароль"
                };
            }

            //Генерація JWT токена
            var token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Success = true,
                Message = "Вхід успішний",
                Token = token,
                User = MapToUserDto(user)
            };
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
