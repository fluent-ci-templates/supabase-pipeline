import * as jobs from "./jobs.ts";

const { deploy, runnableJobs } = jobs;

export default async function pipeline(src = ".", args: string[] = []) {
  if (args.length > 0) {
    await runSpecificJobs(args as jobs.Job[]);
    return;
  }

  await deploy(
    src,
    Deno.env.get("SUPABASE_ACCESS_TOKEN")!,
    Deno.env.get("PROJECT_ID")!
  );
}

async function runSpecificJobs(args: jobs.Job[]) {
  for (const name of args) {
    const job = runnableJobs[name];
    if (!job) {
      throw new Error(`Job ${name} not found`);
    }
    await job(
      ".",
      Deno.env.get("SUPABASE_ACCESS_TOKEN")!,
      Deno.env.get("PROJECT_ID")!
    );
  }
}
