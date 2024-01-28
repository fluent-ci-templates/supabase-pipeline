import { Directory, Secret, dag } from "../../deps.ts";
import { getDirectory, getSupabaseToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = ["node_modules"];

const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";
const BUN_VERSION = Deno.env.get("BUN_VERSION") || "1.0.25";

/**
 * @function
 * @description Deploy to Supabase Edge Functions
 * @param {Directory | string} src The directory to deploy
 * @param {Secret | string} token Supabase access token
 * @param {string} projectId The Supabase project ID
 * @returns {Promise<string>}
 */
export async function deploy(
  src: Directory | string,
  token: Secret | string,
  projectId: string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const secret = await getSupabaseToken(dag, token);

  if (!secret) {
    console.log("No Supabase token found");
    Deno.exit(1);
  }

  const ctr = dag
    .pipeline(Job.deploy)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withUnixSocket(
      "/var/run/docker.sock",
      dag.host().unixSocket("/var/run/docker.sock")
    )
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${NODE_VERSION}`,
      `bun@${BUN_VERSION}`,
      "supabase@1.115.1",
    ])
    .withEnvVariable("PATH", "/root/.bun/bin:$PATH", { expand: true })
    .withDirectory("/app", context)
    .withWorkdir("/app")
    .withSecretVariable("SUPABASE_ACCESS_TOKEN", secret)
    .withExec([
      "supabase",
      "functions",
      "deploy",
      "--project-ref",
      Deno.env.get("PROJECT_ID") || projectId!,
    ]);

  const result = await ctr.stdout();
  return result;
}

export type JobExec = (
  src: Directory | string,
  token: Secret | string,
  projectId: string
) => Promise<string>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.deploy]: deploy,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.deploy]: "Deploy to Supabase Edge Functions",
};
