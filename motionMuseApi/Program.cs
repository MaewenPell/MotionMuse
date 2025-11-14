using Microsoft.EntityFrameworkCore;
using motionMuseApi.Models;
using motionMuseApi.Repositories;
using motionMuseApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

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

  var securitySchema = new OpenApiSecurityScheme
  {
    Description = "Using the Authorization header with the Bearer scheme",
    Name = "Authorization",
    In = ParameterLocation.Header,
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    Reference = new OpenApiReference
    {
      Type = ReferenceType.SecurityScheme,
      Id = "Bearer"
    }
  };


  c.AddSecurityDefinition("Bearer", securitySchema);

  c.AddSecurityRequirement(new OpenApiSecurityRequirement
  {
    { securitySchema, new [] { "Bearer"}}
  });
});


builder.Services.AddControllers();

builder.Services.AddScoped<ITrainingRepository, SqlTrainerRepository>();
builder.Services.AddScoped<IUserRepository, IdentityUserRepository>();
builder.Services.AddScoped<PasswordManager>();

var app = builder.Build();

app.UseCors("Everything");


app.UseAuthentication();   // <-- before authorization
app.UseAuthorization();    // <-- **this makes [Authorize] work**

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();

app.MapControllers();


app.Run();
