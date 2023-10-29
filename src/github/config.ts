import { JobSpec, Workflow } from "fluent_github_actions";

export function generateYaml(): Workflow {
  const workflow = new Workflow("deploy");

  const push = {
    branches: ["main"],
  };

  const setupDagger = `\
  curl -L https://dl.dagger.io/dagger/install.sh | DAGGER_VERSION=0.8.1 sh
  sudo mv bin/dagger /usr/local/bin
  dagger version`;

  const tests: JobSpec = {
    "runs-on": "ubuntu-latest",
    steps: [
      {
        uses: "actions/checkout@v3",
      },
      {
        uses: "denoland/setup-deno@v1",
        with: {
          "deno-version": "v1.37",
        },
      },
      {
        name: "Setup Fluent CI CLI",
        run: "deno install -A -r https://cli.fluentci.io -n fluentci",
      },
      {
        name: "Setup Dagger",
        run: setupDagger,
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
