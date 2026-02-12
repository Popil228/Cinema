using CinemaProject.Server.DTOs.Auth;
using CinemaProject.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Реєстрація нового користувача
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new CinemaProject.Server.DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { error = new CinemaProject.Server.DTOs.ApiError {
                    Code = "BadRequest",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }});
            }

            return Ok(result);
        }

        /// <summary>
        /// Вхід в систему
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = new CinemaProject.Server.DTOs.ApiError {
                    Code = "BadRequest",
                    Message = "Невалідні дані",
                    Target = null,
                    Details = null
                }});
            }

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
            {
                return Unauthorized(new { error = new CinemaProject.Server.DTOs.ApiError {
                    Code = "Unauthorized",
                    Message = result.Message,
                    Target = null,
                    Details = null
                }});
            }

            return Ok(result);
        }

        /// <summary>
        /// Підтвердження Email через код
        /// </summary>
        [HttpPost("confirm-email")]
        public async Task<ActionResult<AuthResponse>> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse { Success = false, Message = "Невалідні дані" });
            }

            var result = await _authService.ConfirmEmailAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Повторне надсилання коду підтвердження
        /// </summary>
        [HttpPost("resend-confirmation-code")]
        public async Task<ActionResult<AuthResponse>> ResendCode([FromBody] ResendCodeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse { Success = false, Message = "Email обов'язковий" });
            }

            var result = await _authService.ResendConfirmationCodeAsync(request.Email);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
