using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using CinemaProject.Server.DTOs;

namespace CinemaProject.Server.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var error = new { 
                error = new ApiError
                {
                    Code = "InternalServerError",
                    Message = exception.Message,
                    Target = null,
                    Details = null
                }
            };

            var result = JsonConvert.SerializeObject(error);
            return context.Response.WriteAsync(result);
        }
    }
}
