
use std::env;
use std::time::{Instant, Duration};
use tauri;
use tauri::Manager;
use std::fs;
use std::sync::mpsc;

use crate::types::{
    Operation,
    CopyProgress,
    CopyProgressType,
    Path,
    PathType,
};

use crate::utils;

#[tauri::command]
pub fn get_home_folder_path() -> Result<Path, String> {
    let home_folder_string = env::var("HOME")
        .or_else(|_| env::var("USERPROFILE"))
        .map_err(|_| "Unable to find the user's home directory".to_string())?;
    Ok(Path {
        path_string: home_folder_string,
        path_type: PathType::Folder,
    })
}

#[tauri::command(async)]
pub fn list_folder_items(path: Path) -> Result<Vec<Path>, String> {
    let mut items = Vec::new();

    for entry_result in fs::read_dir(path.path_string).map_err(|e| format!("Error reading directory: {}", e))? {
        let entry = entry_result.map_err(|e| format!("Error processing entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Error getting metadata: {}", e))?;
        let file_name = entry.path().into_os_string();
        let is_folder = metadata.is_dir();

        items.push(Path {
            path_string: file_name.into_string().unwrap_or_default(),
            path_type: if is_folder { PathType::Folder } else { PathType::File },
        });
    }
    items.sort_by(|a, b| a.path_string.cmp(&b.path_string));
    Ok(items)
}

#[tauri::command(async)]
pub fn copy_one_file(operation: Operation, app_handle: tauri::AppHandle) {
    assert_eq!(operation.is_atomic, true, "Operation must be atomic to copy with progress.");

    let (progress_sender, progress_receiver) = mpsc::channel::<CopyProgress>();

    std::thread::spawn(move || {
        _ = utils::copy_with_progress(&operation, progress_sender);
    });

    let mut last_sent = Instant::now();
    let interval = Duration::from_millis(100);


    for progress in progress_receiver {

        // Rate limit progress updates to once every 100ms.
        let now = Instant::now();
        if (now - last_sent) < interval && 
            progress.copy_progress_type == CopyProgressType::Progress {
            continue;
        }
        app_handle.emit_all("file-copy-progress", Some(progress)).unwrap();
        last_sent = now;
    }
}

#[tauri::command(async)]
#[cfg(target_os = "macos")]
pub fn get_drives() -> Result<Vec<Path>, String> {
    let mut items: Vec<Path> = Vec::new();

    for entry_result in fs::read_dir("/Volumes").map_err(|e| format!("Error reading directory: {}", e))? {
        let entry = entry_result.map_err(|e| format!("Error processing entry: {}", e))?;
        let path_string = entry.path().display().to_string();
        let path = Path {
            path_string,
            path_type: PathType::Folder,
        };
        items.push(path)
    }

    Ok(items)
}

#[tauri::command(async)]
#[cfg(target_os = "windows")]
pub fn get_drives() -> Result<Vec<String>, String> {
    let mut items = Vec::new();

    for entry_result in fs::read_dir("C:\\").map_err(|e| format!("Error reading directory: {}", e))? {
        let entry = entry_result.map_err(|e| format!("Error processing entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Error getting metadata: {}", e))?;
        let file_name = entry.file_name();
        let is_folder = true;

        items.push(FolderItem {
            name: file_name.into_string().unwrap_or_default(),
            is_folder,
        });
    }
    items.sort_by(|a, b| a.name.cmp(&b.name));
    Ok(items)
}