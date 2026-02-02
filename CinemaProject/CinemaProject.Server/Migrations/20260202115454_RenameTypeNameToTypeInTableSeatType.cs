using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenameTypeNameToTypeInTableSeatType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TypeName",
                table: "SeatTypes",
                newName: "Type");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "SeatTypes",
                newName: "TypeName");
        }
    }
}
