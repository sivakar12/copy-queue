import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

import Picker from "./components/picker/Picker";
import Queue from "./components/queue/Queue";
import { useEffect, useState } from 'react';

export type Path = {
  path: string;
  type: 'folder' | 'file';
}
export type QueueItem = {
  id: string;
  source: string;
  destination: string;
  totalBytes?: number;
  bytesCopied?: number;
  filesCopied?: number;
  totalFiles?: number;
};

export type CopyProgress = {
  id: string;
  totalBytes: number;
  bytesCopied: number;
}

function Button({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded" onClick={onClick}>
      {label}
    </div>
  )
}

function App() {
  const startingPath: Path = { path: '/', type: 'folder'}
  const [sourcePath, setSourcePath] = useState<Path>(startingPath) // file or folder
  const [destinationPath, setDestinationPath] = useState<Path>(startingPath) // folder

  const [queue, setQueue] = useState<QueueItem[]>([])

  useEffect(() => {
    invoke<string>('get_home_folder_path').then(pathString => {
      const path: Path = { path: pathString, type: 'folder' }
      setSourcePath(path)
      setDestinationPath(path)
    })
  }, [])

  useEffect(() => {
    const unlisten = listen<CopyProgress>('file-copy-progress', (data) => {
      console.log('here')
      console.log(data)
    })
    return () => { unlisten.then(u => u()) }
  }, [])

  const handleAdd = () => {
    const newQueueItem: QueueItem = {
      id: '1',
      source: sourcePath.path,
      destination: destinationPath.path,
    }
    setQueue([...queue, newQueueItem])
  }

  const handleStartCopying = () => {
    const destinationFilePath = destinationPath.path + '/' + queue[0].source.split('/').pop()
    invoke('copy_one_file', {
      source: queue[0].source,
      destination: destinationFilePath
    })
  
  
  }


  return (
    <div className="container mx-auto h-screen">
      <div className="flex m-1 p-1">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Picker
            onChange={setSourcePath}
            label="source"
            currentPath={sourcePath}
            foldersOnly={false}
          />
          <Picker
            onChange={setDestinationPath}
            label="destination"
            currentPath={destinationPath}
            foldersOnly={true}
          />
          <div className='self-end'>
            <Button onClick={handleAdd} label='Add'/>
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-stretch">
          <div className="flex-1 justify-stretch m-2">
            <Queue
              items={queue}
            />
          </div>
          <div className="flex">
            <Button label="Start Copying" onClick={handleStartCopying}/>
            <Button label="Clear All" onClick={() => {setQueue([])}}/>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
