using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusReservationSystem.Infrastructure.Data.Migrations
{
    public partial class AddCounterNamesToSchedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ArrivalCounter",
                table: "BusSchedules",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StartingCounter",
                table: "BusSchedules",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArrivalCounter",
                table: "BusSchedules");

            migrationBuilder.DropColumn(
                name: "StartingCounter",
                table: "BusSchedules");
        }
    }
}
