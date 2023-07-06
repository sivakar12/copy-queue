# Copy Queue

A better UI/UX for those who copy and paste a lot of files and folders. 

Problems with using the OS's file manager to copy and paste
- Parallel copy is slow operation
  - You can choose speed but then you have to wait for one operation to finish before starting the next
  - Or, you can start the next while copying is in progress and all operations slow done.
- Too many windows are open. You go back and forth. Context switching is mentally taxing.

Here, we make choosing source, choosing destination and running the copying independent operations. Operations are added to the queue. Only one operation runs at one point. 


## How to run

Installers are available at [releases page](https://github.com/sivakar12/copy-queue/releases)

To run in development mode, use
`npm run tauri dev`
