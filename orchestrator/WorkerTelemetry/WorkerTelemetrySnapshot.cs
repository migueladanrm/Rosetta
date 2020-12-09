using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Rosetta.Orchestrator.WorkerTelemetry
{
    public class WorkerTelemetrySnapshot
    {
        public WorkerTelemetrySnapshot() {

        }

        public string WorkerName { get; set; }
        public int UsedMemory { get; set; }
        public double AvailableMemory { get; set; }
        public double MemoryUsage => UsedMemory / AvailableMemory * 100.0;
        public double CpuDelta { get; set; }
        public double SystemCpuDelta { get; set; }
        public int NumberCpus { get; set; }
        public double CpuUsage => CpuDelta / SystemCpuDelta * NumberCpus * 100.0;

        public static WorkerTelemetrySnapshot FromRawData(JObject raw) {
            var cpu = raw["cpu_stats"] as JObject;
            var memory = raw["memory_stats"] as JObject;
            var preCpu = raw["precpu_stats"] as JObject;

            return new WorkerTelemetrySnapshot {
                WorkerName = raw["name"].ToString().Replace("/", ""),
                UsedMemory = (int)memory["usage"] - (int)memory["stats"]["cache"],
                AvailableMemory = (float)memory["limit"],
                CpuDelta = (float)cpu["cpu_usage"]["total_usage"] - (float)preCpu["cpu_usage"]["total_usage"],
                SystemCpuDelta = (float)cpu["system_cpu_usage"] - (float)preCpu["system_cpu_usage"],
                NumberCpus = (int)cpu["online_cpus"]
            };
        }

        public override string ToString() => JsonConvert.SerializeObject(this);
    }
}