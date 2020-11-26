using System;

namespace Rosetta.Orchestrator.Telemetry
{
    public static class Logger
    {
        public static void Log(string message) {
            Console.WriteLine($"[{DateTime.UtcNow:O}]\t{message}");
        }
    }
}