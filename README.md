# Supabase Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fsupabase_pipeline&query=%24.version)](https://pkg.fluentci.io/supabase_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/supabase-pipeline)](https://codecov.io/gh/fluent-ci-templates/supabase-pipeline)

A ready-to-use CI/CD Pipeline for deploying your application to [Supabase Edge Functions](https://supabase.com/edge-functions).

## 🚀 Usage

Run the following command:

```bash
fluentci run supabase_pipeline
```

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/supabase-pipeline@mod
```

## Environment Variables

| Variable              | Description                   |
|-----------------------|-------------------------------|
| SUPABASE_ACCESS_TOKEN | Your Supabase Access Token    |
| PROJECT_ID            | Your Supabase Project ID      |


## Jobs

| Job         | Description                                                |
|-------------|------------------------------------------------------------|
| deploy      | Deploy functions to Supabase Edge Functions                |

```typescript
deploy(
  src: Directory | string,
  token: Secret | string,
  projectId: string
): Promise<string>
```

## Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "https://pkg.fluentci.io/supabase_pipeline@v0.4.1/mod.ts";

await deploy(
    ".", 
    Deno.env.get("SUPABASE_ACCESS_TOKEN")!, 
    Deno.env.get("PROJECT_ID")!
);

```
