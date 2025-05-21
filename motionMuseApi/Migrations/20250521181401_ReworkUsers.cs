using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace motionMuseApi.Migrations
{
    /// <inheritdoc />
    public partial class ReworkUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "User",
                newName: "Token");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Token",
                table: "User",
                newName: "RefreshToken");
        }
    }
}
