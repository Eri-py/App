using System.Text;
using App.Api.Data;
using App.Api.Services.AuthServices.RegistrationServices;
using App.Api.Services.AuthServices.TokenServices;
using App.Api.Services.EmailServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

Console.WriteLine(builder.Configuration["ClientOrigin"]);

if (builder.Environment.IsDevelopment())
{
    // Allow frontend to ping Backend
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(
            name: builder.Configuration["ClientOrigin:Name"]!,
            policy =>
            {
                policy
                    .WithOrigins(
                        builder.Configuration["ClientOrigin:Local"]!,
                        builder.Configuration["ClientOrigin:Network"]!
                    )
                    .AllowAnyHeader();
            }
        );
    });

    // Database Access
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("Development"))
    );

    // Testing Email Service
    builder.Services.AddScoped<IEmailService, MailtrapEmailService>();
}

// Authentication Services
builder.Services.AddScoped<IRegistrationService, RegistrationService>();
builder.Services.AddScoped<IJwtService, JwtService>();

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)
            ),
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseCors(builder.Configuration["ClientOrigin:Name"]!);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
