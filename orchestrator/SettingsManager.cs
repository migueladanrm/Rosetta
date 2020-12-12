using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace Rosetta.Orchestrator
{
    internal class SettingsManager
    {
        public static void LoadSettings() {
            if (File.Exists("env.json")) {
                var settings = JObject.Parse(File.ReadAllText("env.json"));

                foreach (var kv in settings)
                    Environment.SetEnvironmentVariable(kv.Key, (string)kv.Value);
            }
        }
    }
}