use std::fs::{self, File};
use std::io::{Read, Write, BufReader, BufWriter};
use std::sync::mpsc;

// TODO: make utils a folder and create one file for each function

use crate::types::{Operation, CopyProgress, CopyProgressType};

const BUFFER_SIZE: usize = 8192;  // Change buffer size as needed.

pub fn copy_with_progress(operation: &Operation, progress_sender: mpsc::Sender<CopyProgress>) -> std::io::Result<()> {
    assert!(operation.is_atomic, "Operation must be atomic to copy with progress.");
    
    let operation_id = operation.id.clone();
    let file_size_in_bytes: u64 = fs::metadata(&operation.source.path_string).unwrap().len();
    
    let mut total_bytes_copied = 0;

    let src = &operation.source.path_string;
    let dst = &operation.destination.path_string;

    let src = File::open(src)?;
    let dst = File::create(dst)?;

    let mut reader = BufReader::new(src);
    let mut writer = BufWriter::new(dst);
    let mut buffer = [0; BUFFER_SIZE];

    loop {
        match reader.read(&mut buffer) {
            Ok(0) => {
                // EOF reached, flush writer and exit loop.
                writer.flush();
                let copy_progress = CopyProgress {
                    operation_id: operation_id.clone(),
                    copy_progress_type: CopyProgressType::Complete,
                    bytes_copied: total_bytes_copied,
                    total_bytes: file_size_in_bytes,
                };
                progress_sender.send(copy_progress).unwrap();
                break;
            },
            Ok(n) => {
                writer.write_all(&buffer[..n])?;
                total_bytes_copied += n as u64;

                let copy_progress = CopyProgress {
                    operation_id: operation_id.clone(),
                    copy_progress_type: CopyProgressType::Progress,
                    bytes_copied: total_bytes_copied,
                    total_bytes: file_size_in_bytes,
                };
                progress_sender.send(copy_progress).unwrap();
            },
            Err(e) => {
                let copy_progress = CopyProgress {
                    operation_id: operation_id.clone(),
                    copy_progress_type: CopyProgressType::Error,
                    bytes_copied: total_bytes_copied,
                    total_bytes: file_size_in_bytes,
                };
                progress_sender.send(copy_progress).unwrap();
            }
        }
    }
    Ok(())
}

pub fn split_operations(operation: &Operation) -> Vec<Operation> {
    let mut operations = Vec::new();
    // run an operation like "find ." in the mac
    // it should return both folders and files
    // then do a map and distinguish between files and folders
    // this should return path data type
    // then return operationo of type create folder and create

    return operations
}