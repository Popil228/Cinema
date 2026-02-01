namespace CinemaProject.Server.DTOs.Ticket
{
    public class TicketResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class TicketGetResponse : TicketResponse
    {
        public List<TicketDto>? Tickets { get; set; }
    }

    public class TicketDto
    {
        public int SeatNumber { get; set; }
        public int RowNumber { get; set; }
        public string HallName { get; set; }
        public decimal Price { get; set; }
        public string MovieTitle { get; set; }
        public string MoviePosterPath { get; set; }
        public string ShowTime { get; set; }
    }
}
