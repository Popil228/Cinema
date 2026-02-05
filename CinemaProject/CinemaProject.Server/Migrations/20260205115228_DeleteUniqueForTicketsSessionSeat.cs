using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CinemaProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class DeleteUniqueForTicketsSessionSeat : Migration
    {
           protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_SessionSeatId",
                table: "Tickets");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Tickets_SessionSeatId",
                table: "Tickets",
                column: "SessionSeatId",
                unique: true);
        }
    }
}
