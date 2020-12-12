using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rosetta.Orchestrator.Operations
{
    public class OperationTask
    {
        public OperationTask() {

        }

        public Guid Id { get; set; }
        public Guid Operation { get; set; }
        public string FileId { get; set; }
        public string Filter { get; set; }
        public string AssignedWorker { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public string OutputFile { get; set; }

    }
}
