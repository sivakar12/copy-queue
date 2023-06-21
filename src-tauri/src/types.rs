use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FolderItem {
    pub name: String,
    pub is_folder: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CopyRequest {
    pub id: String,
    pub source: String,
    pub destination: String,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CopyProgress {
    pub id: String,
    pub bytes_copied: u64,
    pub total_bytes: u64,
}

// TODO: Types for errors
