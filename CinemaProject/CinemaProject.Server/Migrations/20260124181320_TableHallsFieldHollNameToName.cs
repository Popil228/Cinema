using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class TableHallsFieldHollNameToName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HallName",
                table: "Halls",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Halls",
                newName: "HallName");
        }
    }
}
