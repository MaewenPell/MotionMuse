using Microsoft.EntityFrameworkCore;
using motionMuseApi.Models;
using motionMuseApi.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => options.AddPolicy("Everything", policy =>
{
  policy
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowAnyOrigin();
}));

builder.Services.AddDbContext<MyDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
  options.Authority = "https://dev-motion-muse.eu.auth0.com/";
  options.Audience = "https://motion-muse";
});

builder.Services.AddAuthorization();

// builder.Services.AddSingleton<TrainingService>();

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "MotionMuse", Version = "1.0.0" });

  c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header,
    Name = "Authorization",
    Description = "Using the Authorization header with the Bearer scheme",
  });

  c.AddSecurityRequirement(document =>
    new OpenApiSecurityRequirement
  {
    [new OpenApiSecuritySchemeReference("Bearer", document)] = []
  });
});


builder.Services.AddControllers();

builder.Services.AddScoped<ITrainingRepository, SqlTrainerRepository>();
var app = builder.Build();

app.UseCors("Everything");

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

app.MapControllers();


app.Run();
