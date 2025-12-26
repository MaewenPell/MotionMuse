using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace motionMuseApi.Migrations
{
    /// <inheritdoc />
    public partial class AddStravaLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Training",
                table: "Training");

            migrationBuilder.RenameTable(
                name: "Training",
                newName: "trainings");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "trainings",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_trainings",
                table: "trainings",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "strava_links",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Auth0UserId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    StravaAthleteId = table.Column<long>(type: "bigint", nullable: false),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_strava_links", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_strava_links_Auth0UserId",
                table: "strava_links",
                column: "Auth0UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "strava_links");

            migrationBuilder.DropPrimaryKey(
                name: "PK_trainings",
                table: "trainings");

            migrationBuilder.RenameTable(
                name: "trainings",
                newName: "Training");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Training",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Training",
                table: "Training",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExpiresAt = table.Column<int>(type: "integer", nullable: false),
                    ExpiresIn = table.Column<int>(type: "integer", nullable: false),
                    IsAccountFinalized = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: false),
                    Token = table.Column<string>(type: "text", nullable: false),
                    Username = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });
        }
    }
}
