
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::{Command, Stdio};
use tokio;

#[tauri::command]
fn start_exe(exe_path : String) -> () {
    println!("Hello {}! You've been greeted from Rust!",exe_path);
    Command::new("powershell")
        .arg("-Command") // 长格式列表
        .arg(exe_path)
        .stdout(Stdio::inherit()) // 直接继承父进程的 stdout
        .spawn() // 启动子进程
        .expect("Failed to start command")
        .wait() // 等待命令完成
        .expect("Command wasn't running");
}

#[tauri::command]
async fn get_hardware_info(class_name: String) -> Result<String, String> {
    let pwsh_command = if class_name == "monitor" {
        r#"Get-WmiObject -Namespace root\wmi -Class WmiMonitorID -ErrorAction SilentlyContinue | ConvertTo-Json"#.to_string()
    } else {
        format!("Get-CimInstance -ClassName {} | ConvertTo-Json", class_name)
    };

    match exe_command_async(pwsh_command).await {
        Ok(output) => Ok(output),
        Err(e) => Err(e.to_string()),
    }
}

// 异步执行 PowerShell 命令（内部使用 spawn_blocking）
async fn exe_command_async(pwsh_command: String) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let output = tokio::task::spawn_blocking(move || {
        Command::new("powershell")
            .arg("-Command")
            .arg(format!(
                "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; {}",
                pwsh_command
            ))
            .output()
    })
    .await??; // 第一个 ? 解包 JoinHandle，第二个 ? 解包 Result<Output, Error>

    let stdout = String::from_utf8(output.stdout)
        .map_err(|e| format!("Invalid UTF-8 in command output: {}", e))?;

    Ok(stdout)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_exe,get_hardware_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

