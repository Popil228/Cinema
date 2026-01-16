using System.Net.NetworkInformation;
using System.Net.Sockets;

namespace CinemaProject.Server.Models.Entitys
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int SessionId { get; set; }
        public DateTime BookingAt { get; set; }
        public decimal TotalPrice { get; set; }
        public int StatusId { get; set; }

        public AppUser User { get; set; } = null!;
        public Status Status { get; set; } = null!;
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
