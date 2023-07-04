// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

mod utils;
mod types;
mod commands;

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
        .invoke_handler(tauri::generate_handler![
            commands::get_home_folder_path, 
            commands::list_folder_items, 
            commands::run_atomic_operation,
            commands::get_drives,
            commands::get_tree,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
