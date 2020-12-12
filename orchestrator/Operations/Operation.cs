using Newtonsoft.Json.Linq;
using System;

namespace Rosetta.Orchestrator.Operations
{
    public class Operation
    {
        public Operation() {

        }

        public Guid Id { get; set; }
        public string Description { get; set; }
        public JArray Items { get; set; }
        public JArray Filters { get; set; }
        public bool IsDone { get; set; }
        public DateTime Creation { get; set; }
    }
}
