use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FolderItem {
    pub name: String,
    pub is_folder: bool,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CopyProgress {
    pub id: String,
    pub bytes_copied: u64,
    pub total_bytes: u64,
}

// TODO: Types for errors
