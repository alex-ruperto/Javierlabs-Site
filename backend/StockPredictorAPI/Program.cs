using AlexBotAPI.Helper;
using CSnakes.Runtime;
using CSnakes.Runtime.Locators;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var pythonBuilder = builder.Services.WithPython();

// Use Serilog for logging from the start
builder.Host.UseSerilog((context, config) =>
{
    config.MinimumLevel.Debug()
        .WriteTo.Console()
        .WriteTo.File("logs/alexbotapi_service.log", rollingInterval: RollingInterval.Day);
});

// Path to venv directory
var home = Path.Join(Environment.CurrentDirectory, "StockPredictorRepo");
var venv = Path.Join(home, ".venv");
pythonBuilder
    .WithHome(home)
    .WithVirtualEnvironment(venv)
    .WithPipInstaller();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<PythonLocator>(new ContainerLocator());

var app = builder.Build();

// Background task to call Python function
app.Lifetime.ApplicationStarted.Register(() =>
{
    try
    {
        var env = app.Services.GetRequiredService<IPythonEnvironment>();

        // Import the module and call the function
        var fetchData = env.FetchData();
        var result = fetchData.FetchStockData("AAPL", "2020-10-24", "2022-10-24", "Min");
        Log.Information($"Fetch result: {result}");
    }
    catch (Exception ex)
    {
        Log.Information($"Error invoking Python function: {ex.Message}");
    }
});

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();