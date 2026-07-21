using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Name", "Password", "RightCode" },
                values: new object[] { "viewer1", "1234", 0 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Name", "Password", "RightCode" },
                values: new object[] { "editor1", "1234", 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Name",
                keyValue: "viewer1");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Name",
                keyValue: "editor1");
        }
    }
}
