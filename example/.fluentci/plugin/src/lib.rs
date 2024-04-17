use std::vec;

use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup(version: String) -> FnResult<String> {
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };
    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "install",
            &format!("supabase.com/cli@{}", version),
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn deploy(args: String) -> FnResult<String> {
    let version = dag().get_env("SUPABASE_CLI_VERSION").unwrap_or_default();
    let version = if version.is_empty() {
        "latest".to_string()
    } else {
        version
    };

    let stdout = dag()
        .pkgx()?
        .with_exec(vec![
            "pkgx",
            "install",
            &format!("supabase.com/cli@{}", version),
        ])?
        .with_exec(vec!["supabase", "functions", "deploy", &args])?
        .stdout()?;
    Ok(stdout)
}
