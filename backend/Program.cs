var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // כתובת ה-Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


app.Run();