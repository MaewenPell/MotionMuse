using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace motionMuseApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Training",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    LengthInKm = table.Column<double>(type: "double precision", nullable: false),
                    ElevationGainInM = table.Column<double>(type: "double precision", nullable: false),
                    NumberOfReps = table.Column<double>(type: "double precision", nullable: false),
                    NumberOfIntervals = table.Column<double>(type: "double precision", nullable: false),
                    IntervalDurationInSeconds = table.Column<double>(type: "double precision", nullable: false),
                    IntervalRestDurationInSeconds = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Training", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Training");
        }
    }
}
