namespace CinemaProject.Server.DTOs.SessionSeat
{
    public class SessionSeatDto
    {
        public int SessionSeatId { get; set; }
        public int SessionId { get; set; }
        public int SeatId { get; set; }
        public bool IsActive { get; set; }
        public short RowNumber { get; set; }
        public short SeatNumber { get; set; }
        public string? SeatType { get; set; }
    }

    public class CreateSessionSeatDto
    {
        public int SessionId { get; set; }
        public int SeatId { get; set; }
    }

    public class SessionSeatResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public SessionSeatDto? Data { get; set; }
    }

    public class SessionSeatListResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public List<SessionSeatDto> Data { get; set; } = new();
    }
}