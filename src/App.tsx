import { invoke } from '@tauri-apps/api/tauri'

import Header from "./components/Header";
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
};

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
        <Header/>
      <div className="grid grid-cols-2 gap-4">
        <div>
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
          <button onClick={handleAdd} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Add
          </button>
        </div>
        <Queue
          items={queue}
        />
      </div>
    </div>

  );
}

export default App;
