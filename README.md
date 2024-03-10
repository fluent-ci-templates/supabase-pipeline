# Supabase Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fsupabase_pipeline&query=%24.version)](https://pkg.fluentci.io/supabase_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.10.0-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/supabase)](https://jsr.io/@fluentci/supabase)
[![](https://img.shields.io/codecov/c/gh/fluent-ci-templates/supabase-pipeline)](https://codecov.io/gh/fluent-ci-templates/supabase-pipeline)
[![ci](https://github.com/fluent-ci-templates/supabase-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/supabase-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for deploying your application to [Supabase Edge Functions](https://supabase.com/edge-functions).

## 🚀 Usage

Run the following command:

```bash
fluentci run supabase_pipeline
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/supabase-pipeline@main
```

Call a function from the module:

```bash
dagger -m github.com/fluent-ci-templates/supabase-pipeline@main call \
  deploy --src . \
  --token env:SUPABASE_ACCESS_TOKEN \
  --projectId $PROJECT_ID
```

## 🛠️ Environment Variables

| Variable              | Description                   |
|-----------------------|-------------------------------|
| SUPABASE_ACCESS_TOKEN | Your Supabase Access Token    |
| PROJECT_ID            | Your Supabase Project ID      |

## ✨ Jobs

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

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```typescript
import { deploy } from "jsr:@fluentci/supabase";

await deploy(
    ".", 
    Deno.env.get("SUPABASE_ACCESS_TOKEN")!, 
    Deno.env.get("PROJECT_ID")!
);

```
