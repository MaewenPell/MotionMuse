using Microsoft.EntityFrameworkCore;
using motionMuseApi.Models;
using motionMuseApi.Repositories;
using motionMuseApi.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MyDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddNewtonsoftJson();

// builder.Services.AddSingleton<TrainingService>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

builder.Services.AddScoped<ITrainingRepository, SqlTrainerRepository>();
builder.Services.AddScoped<IUserRepository, IdentityUserRepository>();
builder.Services.AddScoped<PasswordManager>();

var app = builder.Build();

app.UseCors("AllowAllOrigins");
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

app.MapControllers();


app.Run();
