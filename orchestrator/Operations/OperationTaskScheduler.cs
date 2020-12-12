using Newtonsoft.Json.Linq;
using Rosetta.Orchestrator.WorkerTelemetry;
using System.Collections.Generic;
using System.Linq;
using static Rosetta.Orchestrator.Telemetry.Logger;

namespace Rosetta.Orchestrator.Operations
{
    public class OperationTaskScheduler {
        private OperationsRepository repository;
        private WorkerNotificationHandler notificationHandler;
        //private WorkerStatusWatcher workerStatusWatcher;

        //public OperationTaskScheduler(OperationsRepository operationsRepository, WorkerStatusWatcher workerStatusWatcher, WorkerNotificationHandler notificationHandler) {
        public OperationTaskScheduler(OperationsRepository operationsRepository, WorkerNotificationHandler notificationHandler) {
            repository = operationsRepository;
            //this.workerStatusWatcher = workerStatusWatcher;
            this.notificationHandler = notificationHandler;
        }

        public void HandleOperation(string id) {
            Log($"Iniciando proceso de asignación de tareas de la operación '{id}'...");

            //var workerStats = workerStatusWatcher.RetrieveCurrentWorkersStats();
            //var workerNames = workerStats.Select(wsw => wsw.WorkerName).ToList();
            var workerNames = Worker.GetWorkers().Select(w => w.Id).ToList();
            var operation = repository.GetOperation(id);
            var tasks = repository.GetOperationTasks(id);
            var nFilters = operation.Filters.Count;
            var nItems = operation.Items.Count;
            var nOperations = nItems * nFilters;

            Log($"Operaciones: {tasks.Count}");

            if (nOperations < 1)
                return;

            Log($"Asignando {nOperations} tareas...");

            if (nOperations == 1) {
                //var worker = workerStats.OrderByDescending(wsw => wsw.CpuUsage).First().WorkerName;
                var worker = workerNames.First();
                repository.AssignOperationTask(tasks.First().Id.ToString(), worker);
            }

            var assignments = new Dictionary<string, List<string>>();
            foreach (var worker in workerNames)
                assignments.Add(worker, new List<string>());

            var size = nOperations / workerNames.Count;

            Log("Distribuyendo tareas entre nodos...");

            int i = 0;
            foreach (var kv in assignments) {
                tasks.Skip(i * size).Take(size).ToList().ForEach(task => {
                    assignments[kv.Key].Add(task.Id.ToString());
                });

                i++;
            }

            foreach (var kv in assignments) {
                kv.Value.ForEach(taskId => {
                    Log($"Asignando tarea '{taskId}' a nodo '{kv.Key}'...");

                    repository.AssignOperationTask(taskId, kv.Key);
                });
            }

            notificationHandler.NotifyWorkers(JObject.Parse("{\"operation\":\"ID\"}".Replace("ID", id)));

            Log("Asignación finalizada. Se procede a notificar a los nodos.");
        }
    }
}
