using Newtonsoft.Json.Linq;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Rosetta.Orchestrator.WorkerTelemetry
{
    public class WorkerStatusWatcher
    {
        private Dictionary<string, List<WorkerTelemetrySnapshot>> stats;
        private const int MAX_HISTORY_SIZE = 10;

        public WorkerStatusWatcher() {
            stats = new Dictionary<string, List<WorkerTelemetrySnapshot>>();

            using var connection = ConnectionManager.GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT id FROM public.worker;", connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
                stats.Add((string)reader["id"], new List<WorkerTelemetrySnapshot>(MAX_HISTORY_SIZE));

            Monitor();
        }

        public void Monitor() {
            new Thread(new ThreadStart(() => {
                while (true) {
                    Parallel.ForEach(stats.Keys, worker => {
                        var wc = new WebClient();
                        var raw = wc.DownloadString(Environment.GetEnvironmentVariable("ORCHESTRATOR_DOCKER_STATS_ENDPOINT").Replace("{WORKER_ID}", worker));
                        var wts = WorkerTelemetrySnapshot.FromRawData(JObject.Parse(raw));

                        if (stats[worker].Count >= MAX_HISTORY_SIZE)
                            stats[worker].RemoveAt(MAX_HISTORY_SIZE - 1);

                        stats[worker].Insert(0, wts);
                    });

                    Thread.Sleep(1000);
                }
            })).Start();
        }

        public List<WorkerTelemetrySnapshot> RetrieveCurrentWorkersStats() {
            var result = new List<WorkerTelemetrySnapshot>();

            foreach (var kv in stats) {
                if (kv.Value.Count < 1)
                    break;

                result.Add(new WorkerTelemetrySnapshot {
                    AvailableMemory = kv.Value.Average(wts => wts.AvailableMemory),
                    CpuDelta = kv.Value.Average(wts => wts.CpuDelta),
                    NumberCpus = (int)kv.Value.Average(wts => wts.NumberCpus),
                    SystemCpuDelta = kv.Value.Average(wts => wts.SystemCpuDelta),
                    UsedMemory = (int)kv.Value.Average(wts => wts.UsedMemory),
                    WorkerName = kv.Key
                });
            }

            return result;
        }
    }
}