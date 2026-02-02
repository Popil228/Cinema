using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CinemaProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixDleteRoot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionSeats_Sessions_SessionId",
                table: "SessionSeats");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_SessionSeats_SessionSeatId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionSeats_Sessions_SessionId",
                table: "SessionSeats",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "SessionId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_SessionSeats_SessionSeatId",
                table: "Tickets",
                column: "SessionSeatId",
                principalTable: "SessionSeats",
                principalColumn: "SessionSeatId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SessionSeats_Sessions_SessionId",
                table: "SessionSeats");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_SessionSeats_SessionSeatId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_SessionSeats_Sessions_SessionId",
                table: "SessionSeats",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "SessionId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_SessionSeats_SessionSeatId",
                table: "Tickets",
                column: "SessionSeatId",
                principalTable: "SessionSeats",
                principalColumn: "SessionSeatId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
