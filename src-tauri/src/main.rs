// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use serde::Serialize;
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct FolderItem {
    name: String,
    is_folder: bool,
}

#[tauri::command]
fn get_home_folder_path() -> Result<String, String> {
    let home_dir = env::var("HOME")
        .or_else(|_| env::var("USERPROFILE"))
        .map_err(|_| "Unable to find the user's home directory".to_string())?;
    Ok(home_dir)
}

#[tauri::command]
fn list_folder_items(path: &str) -> Result<Vec<FolderItem>, String> {
    let mut items = Vec::new();

    for entry_result in fs::read_dir(path).map_err(|e| format!("Error reading directory: {}", e))? {
        let entry = entry_result.map_err(|e| format!("Error processing entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Error getting metadata: {}", e))?;
        let file_name = entry.file_name();
        let is_folder = metadata.is_dir();

        items.push(FolderItem {
            name: file_name.into_string().unwrap_or_default(),
            is_folder,
        });
    }

    Ok(items)
}
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
                
            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");
    
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, get_home_folder_path, list_folder_items])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
