import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("deploy");

  const push = {
    branches: ["main"],
  };

  const tests: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v3",
      },
      {
        name: "Setup Fluent CI",
        uses: "fluentci-io/setup-fluentci@v2",
      },
      {
        name: "Run Dagger Pipelines",
        run: "fluentci run supabase_pipeline deploy",
        env: {
          SUPABASE_ACCESS_TOKEN: "${{ secrets.SUPABASE_ACCESS_TOKEN }}",
          PROJECT_ID: "${{ secrets.PROJECT_ID }}",
        },
      },
    ],
  };

  workflow.on({ push }).jobs({ tests });

  return workflow;
}
