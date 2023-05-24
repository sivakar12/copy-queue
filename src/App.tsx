import { invoke } from '@tauri-apps/api/tauri'

import Picker from "./components/Picker";
import Queue from "./components/Queue";
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

  const handleAdd = () => {
    const newQueueItem: QueueItem = {
      id: '1',
      source: sourcePath.path,
      destination: destinationPath.path,
    }
    setQueue([...queue, newQueueItem])
  }


  return (
    <div className="container mx-auto">
      <div className="flex">
        <div className="flex flex-col flex-1">
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
        <div className="flex flex-col flex-1">
          <div className="flex-1 justify-stretch">
            <Queue
              items={queue}
            />
          </div>
          <div className="flex">
            <Button label="Start Copying" onClick={() => {}}/>
            <Button label="Clear All" onClick={() => {setQueue([])}}/>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
