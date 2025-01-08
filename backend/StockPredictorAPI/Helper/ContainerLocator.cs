using CSnakes.Runtime;
using CSnakes.Runtime.Locators;

namespace AlexBotAPI.Helper;

internal sealed class ContainerLocator : PythonLocator
{
    public ContainerLocator() => Version = ServiceCollectionExtensions.ParsePythonVersion("3.12");

    protected override Version Version { get; }

    public override PythonLocationMetadata LocatePython()
    {
        string basePath = Environment.CurrentDirectory; // The directory of StockPredictorAPI
        string pythonFolder = Path.Combine(basePath, "StockPredictorRepo", ".venv", "bin");
        string libPythonPath =
            "/usr/local/Cellar/python@3.12/3.12.8/Frameworks/Python.framework/Versions/3.12/lib/libpython3.12.dylib";
        string stdLibPath =
            "/usr/local/Cellar/python@3.12/3.12.8/Frameworks/Python.framework/Versions/3.12/lib/python3.12"; // Add stdlib path
        
        string pythonPath = string.Join(Path.PathSeparator, new[]
        {
            Path.Combine(basePath, "StockPredictorRepo"), // Include StockPredictorRepo for utils
            Path.Combine(basePath, "StockPredictorRepo", ".venv", "lib", "python3.12", "site-packages"),
            "/usr/local/Cellar/python@3.12/3.12.8/Frameworks/Python.framework/Versions/3.12/lib/python3.12" // stdlib path
        });

        string pythonExec = Path.Combine(basePath, "StockPredictorRepo", ".venv", "bin", "python3.12");

        PythonLocationMetadata result = new(
            pythonFolder, 
            Version, 
            libPythonPath, 
            pythonPath + Path.PathSeparator + stdLibPath,  
            pythonExec, 
            Debug: true);

        return result;
    }
}
