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

export type Queue = {
  [id: string]: QueueItem;
}

function App() {
  const startingPath: Path = { path: '/', type: 'folder'}
  const [sourcePath, setSourcePath] = useState<Path>(startingPath) // file or folder
  const [destinationPath, setDestinationPath] = useState<Path>(startingPath) // folder

  const [queue, setQueue] = useState<Queue>({});

  useEffect(() => {
    invoke<string>('get_home_folder_path').then(pathString => {
      const path: Path = { path: pathString, type: 'folder' }
      setSourcePath(path)
      setDestinationPath(path)
    })
  }, [])

  useEffect(() => {
    const unlisten = listen<CopyProgress>('file-copy-progress', (data) => {
      const copyProgrssData = data.payload;
      console.log(copyProgrssData)
      setQueue((prevQueue) => {
        const queueItem = prevQueue[copyProgrssData.id]
        const newQueueItem = {
          ...queueItem,
          totalBytes: copyProgrssData.totalBytes,
          bytesCopied: copyProgrssData.bytesCopied,
        }
        return {
          ...prevQueue,
          [copyProgrssData.id]: newQueueItem
        }
      })
    })
    return () => { unlisten.then(u => u()) }
  }, [])

  const handleAdd = () => {
    // TODO: What is a better id string?
    const timestampString = new Date().getTime().toString()
    const newQueueItem: QueueItem = {
      id: timestampString,
      source: sourcePath.path,
      destination: destinationPath.path,
    }
    setQueue({
      ...queue,
      [newQueueItem.id]: newQueueItem
    })
  }

  const handleStartCopying = () => {
    // This copies only the first item in the queue for now.
    const firstItem = Object.values(queue)[0]
    const destinationFilePath = destinationPath.path + '/' + firstItem.source.split('/').pop()
    invoke('copy_one_file', {
      copyRequest: {
        id: firstItem.id,
        source: firstItem.source,
        destination: destinationFilePath
      }
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
              queue={queue}
            />
          </div>
          <div className="flex">
            <Button label="Start Copying" onClick={handleStartCopying}/>
            <Button label="Clear All" onClick={() => {setQueue({})}}/>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
