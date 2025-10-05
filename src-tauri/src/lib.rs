// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::{Command, Stdio};

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_exe])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// #[tauri::command]
// fn my_custom_command() {
//   println!("I was invoked from JavaScript!");
// }
