using System.Net.NetworkInformation;
using System.Net.Sockets;

namespace CinemaProject.Server.Models.Entitys
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int? DiscountId { get; set; }
        public DateTime BookingAt { get; set; } = DateTime.UtcNow;
        public decimal TotalPrice { get; set; }
        public enum BookingStatus
        {
            Confirmed, 
            Cancelled
        }

        public BookingStatus Status { get; set; }

        public AppUser AppUser { get; set; } = null!;
        public Discount? Discount { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
