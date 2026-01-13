using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Server.Models.Entitys
{
    public class UserRole
    {
        [Key]
        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;

        public ICollection<AppUser> Users { get; set; } = new List<AppUser>();
    }
}
