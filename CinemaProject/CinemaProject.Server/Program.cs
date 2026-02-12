using CinemaProject.Server.Data;
using CinemaProject.Server.Interfaces;
using CinemaProject.Server.Models.Settings;
using CinemaProject.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddMemoryCache();

// DbContext
builder.Services.AddDbContext<CinemaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Auth
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            // Override the default behavior to return 401
            context.HandleResponse();
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ManageMovies", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageActors", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageMovieRelations", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageHalls", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageSessions", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageTMDBs", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageDiscounts", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageBookings", policy => policy.RequireRole("Admin", "Manager"));
    options.AddPolicy("ManageTickets", policy => policy.RequireRole("Admin", "Manager"));

    options.AddPolicy("UserOrAdminDiscounts", policy => policy.RequireRole("User", "Admin"));
    options.AddPolicy("UserOrAdminBookings", policy => policy.RequireRole("User", "Admin"));
    options.AddPolicy("UserOrAdminTickets", policy => policy.RequireRole("User", "Admin"));
});

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// HTTP Client
builder.Services.AddHttpClient();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IActorService, ActorService>();
builder.Services.AddScoped<ITmdbService, TmdbService>();
builder.Services.AddScoped<IMovieActorService, MovieActorService>();
builder.Services.AddScoped<IMovieGenreService, MovieGenreService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ISessionSeatService, SessionSeatService>();
builder.Services.AddScoped<IDiscountService, DiscountService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<ITicketService, TicketService>();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CinemaProject.Server | v1");
    });
}

// Глобальна обробка помилок
app.UseMiddleware<CinemaProject.Server.Middleware.ExceptionMiddleware>();

app.UseCors();

app.UseDefaultFiles();
app.MapStaticAssets();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
