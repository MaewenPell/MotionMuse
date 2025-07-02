using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace motionMuseApi.Migrations
{
    /// <inheritdoc />
    public partial class addTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExpiresAt",
                table: "User",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ExpiresIn",
                table: "User",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAccountFinalized",
                table: "User",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "ExpiresIn",
                table: "User");

            migrationBuilder.DropColumn(
                name: "IsAccountFinalized",
                table: "User");
        }
    }
}
