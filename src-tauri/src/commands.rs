
use std::env;
use tauri;
use tauri::Manager;
use std::fs;
use std::sync::mpsc;

use crate::types::FolderItem;
use crate::utils;
use crate::types;
#[tauri::command]
pub fn get_home_folder_path() -> Result<String, String> {
    let home_dir = env::var("HOME")
        .or_else(|_| env::var("USERPROFILE"))
        .map_err(|_| "Unable to find the user's home directory".to_string())?;
    Ok(home_dir)
}

#[tauri::command]
pub fn list_folder_items(path: &str) -> Result<Vec<FolderItem>, String> {
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
    items.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(items)
}

#[tauri::command]
pub fn copy_one_file(source: String, destination: String, app_handle: tauri::AppHandle) -> tauri::Result<()> {
    let id = destination.clone();
    let (progress_sender, progress_receiver) = mpsc::channel();
    let file_size_int_bytes = fs::metadata(&source).unwrap().len();

    std::thread::spawn(move || {
        _ = utils::copy_with_progress(&source, &destination, progress_sender);
    });

    for progress in progress_receiver {
        let progress = types::CopyProgress {
            id: id.clone(),
            bytes_copied: progress,
            total_bytes: file_size_int_bytes,
        };
        app_handle.emit_all("file-copy-progress", Some(progress)).unwrap();
    }

    Ok(())
}