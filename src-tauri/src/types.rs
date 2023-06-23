use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum PathType {
    File,
    Folder,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Path {
    pub path_string: String,
    pub path_type: PathType, 
}

#[derive(Debug, Serialize, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum CopyProgressType {
    Progress,
    Complete,
    Error
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CopyProgress {
    pub operation_id: String,
    pub bytes_copied: u64,
    pub total_bytes: u64,
    pub copy_progress_type: CopyProgressType,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub enum OperationType {
    Copy,
    Move,
    CreateFolder,
    Delete,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Operation {
    pub id: String,
    pub source: Path,
    pub destination: Path,
    pub operation_type: OperationType,
    pub is_atomic: bool,
}
