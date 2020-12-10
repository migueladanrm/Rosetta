using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace Rosetta.Orchestrator
{
    internal class SettingsManager
    {
        internal enum OrchestratorSettings
        {
            RabbitMqUrl
        }

        private static bool settingsDidLoaded = false;

        internal static string GetSetting(OrchestratorSettings targetSetting) {
#if DEBUG
            if (!settingsDidLoaded)
                LoadSettings();
#endif

            var target = string.Empty;

            switch (targetSetting) {
                case OrchestratorSettings.RabbitMqUrl:
                    target = Environment.GetEnvironmentVariable("ORCHESTRATOR_RABBITMQ_URL");
                    break;
            }

            return target;
        }

        public static void LoadSettings() {
            if (File.Exists("env.json")) {
                var settings = JObject.Parse(File.ReadAllText("env.json"));

                foreach (var kv in settings)
                    Environment.SetEnvironmentVariable(kv.Key, (string)kv.Value);
            }
        }
    }
}