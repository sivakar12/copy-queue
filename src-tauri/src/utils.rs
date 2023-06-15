use std::fs::File;
use std::io::{self, Read, Write, BufReader, BufWriter};
use std::sync::mpsc;

const BUFFER_SIZE: usize = 8192;  // Change buffer size as needed.

pub fn copy_with_progress(src: &str, dst: &str, progress_sender: mpsc::Sender<u64>) -> io::Result<u64> {
    let mut total_bytes_copied = 0;

    let src = File::open(src)?;
    let dst = File::create(dst)?;
    let mut reader = BufReader::new(src);
    let mut writer = BufWriter::new(dst);
    let mut buffer = [0; BUFFER_SIZE];

    loop {
        match reader.read(&mut buffer) {
            Ok(0) => {
                // EOF reached, flush writer and exit loop.
                writer.flush()?;
                break;
            },
            Ok(n) => {
                writer.write_all(&buffer[..n])?;
                total_bytes_copied += n as u64;

                // Send the current progress via the channel.
                progress_sender.send(total_bytes_copied).unwrap();
            },
            Err(e) => return Err(e),
        }
    }

    Ok(total_bytes_copied)
}

