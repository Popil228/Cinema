using System.Collections.Generic;

namespace CinemaProject.Server.DTOs
{
    public class ApiError
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public string Target { get; set; }
        public List<ApiError> Details { get; set; }
    }
}
