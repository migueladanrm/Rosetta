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
        private WebClient wc;
        private Dictionary<string, List<WorkerTelemetrySnapshot>> stats;
        private const int MAX_HISTORY_SIZE = 10;

        public WorkerStatusWatcher() {
            stats = new Dictionary<string, List<WorkerTelemetrySnapshot>>();
            wc = new WebClient();

            using var connection = DatabaseConnectionManager.GetDatabaseConnection();
            using var command = new NpgsqlCommand("SELECT id FROM public.worker;", connection);
            using var reader = command.ExecuteReader();
            while (reader.Read())
                stats.Add((string)reader["id"], new List<WorkerTelemetrySnapshot>(MAX_HISTORY_SIZE));
        }

        public WorkerTelemetrySnapshot RetrieveCurrentStats() {
            var url = "http://localhost:2375/containers/rosetta-mongo/stats?stream=false";
            var data = wc.DownloadString(url);

            return WorkerTelemetrySnapshot.FromRawData(JObject.Parse(data));
        }

        public void Monitor() {
            new Thread(new ThreadStart(() => {
                while (true) {
                    Parallel.ForEach(stats.Keys, worker => {
                        var raw = wc.DownloadString(Environment.GetEnvironmentVariable("ORCHESTRATOR_DOCKER_STATS_API"));
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