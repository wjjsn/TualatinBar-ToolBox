
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::process::{Command, Stdio};
use std::thread;

#[tauri::command]
fn start_exe(exe_path : String) -> () {
    println!("Hello {}! You've been greeted from Rust!",exe_path);
    Command::new("pwsh")
        .arg("-Command") // 长格式列表
        .arg(exe_path)
        .stdout(Stdio::inherit()) // 直接继承父进程的 stdout
        .spawn() // 启动子进程
        .expect("Failed to start command")
        .wait() // 等待命令完成
        .expect("Command wasn't running");
}

fn exe_command(pwsh_command:String)->String{
    let handle = thread::spawn(move || {
        // 创建命令对象
        let output = Command::new("powershell")
            .arg("-Command")
            .arg(format!(
                "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $OutputEncoding = [System.Text.Encoding]::UTF8; {}",
                pwsh_command
            ))
            .output()  // 执行命令并等待输出
            .expect("Failed to execute command");

        // 将输出转换为字符串
        String::from_utf8(output.stdout)
            .expect("Invalid UTF-8 in command output")
    });

    // 等待线程完成并获取结果
    let result=handle.join().expect("Thread panicked");
    // println!("{}",result);
    result
    
}

#[tauri::command]
fn get_hardware_info(class_name:String)->String{
    if class_name=="monitor" {
        exe_command(r"Get-WmiObject -Namespace root\wmi -Class WmiMonitorID -ErrorAction SilentlyContinue | ConvertTo-Json".into())
    }else {
        exe_command(format!("Get-CimInstance -ClassName {} | ConvertTo-Json",class_name))
    }
        
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_exe,get_hardware_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

