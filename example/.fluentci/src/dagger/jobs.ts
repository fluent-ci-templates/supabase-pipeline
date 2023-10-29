import Client, { connect } from "../../deps.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = ["node_modules"];

const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";
const BUN_VERSION = Deno.env.get("BUN_VERSION") || "1.0.3";

export const deploy = async (src = ".", token?: string, projectId?: string) => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = client
      .pipeline(Job.deploy)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec([
        "pkgx",
        "install",
        `node@${NODE_VERSION}`,
        `bun@${BUN_VERSION}`,
        "supabase",
      ])
      .withEnvVariable("PATH", "/root/.bun/bin:$PATH", { expand: true })
      .withDirectory("/app", context)
      .withWorkdir("/app")
      .withEnvVariable(
        "SUPABASE_ACCESS_TOKEN",
        Deno.env.get("SUPABASE_ACCESS_TOKEN") || token!
      )
      .withExec([
        "supabase",
        "functions",
        "deploy",
        "--project-ref",
        Deno.env.get("PROJECT_ID") || projectId!,
      ]);

    await ctr.stdout();
  });

  return "Done";
};

export type JobExec = (
  src?: string,
  token?: string,
  projectId?: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Supabase Edge Functions",
};
