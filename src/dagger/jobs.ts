import Client, { Directory, Secret } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory, getSupabaseToken } from "./lib.ts";

export enum Job {
  deploy = "deploy",
}

export const exclude = ["node_modules"];

const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";
const BUN_VERSION = Deno.env.get("BUN_VERSION") || "1.0.3";

/**
 * @function
 * @description Deploy to Supabase Edge Functions
 * @param {Directory | string} src The directory to deploy
 * @param {Secret | string} tokenThe Supabase access token
 * @param {string} projectId The Supabase project ID
 * @returns {Promise<string>}
 */
export async function deploy(
  src: Directory | string,
  token: Secret | string,
  projectId: string
): Promise<string> {
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const secret = getSupabaseToken(client, token);

    if (!secret) {
      console.log("No Supabase token found");
      Deno.exit(1);
    }

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
      .withSecretVariable("SUPABASE_ACCESS_TOKEN", secret)
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
