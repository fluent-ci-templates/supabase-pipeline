/**
 * @module supabase
 * @description Deploy to Supabase Edge Functions
 */
import { Directory, Secret, dag, env, exit } from "../../deps.ts";
import { getDirectory, getSupabaseToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = ["node_modules"];

const NODE_VERSION = env.get("NODE_VERSION") || "18.16.1";
const BUN_VERSION = env.get("BUN_VERSION") || "1.0.30";

/**
 * Deploy to Supabase Edge Functions
 *
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
  const context = await getDirectory(src);
  const secret = await getSupabaseToken(token);

  if (!secret) {
    console.log("No Supabase token found");
    exit(1);
    return "";
  }

  const ctr = dag
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
      env.get("PROJECT_ID") || projectId!,
    ]);

  return ctr.stdout();
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
