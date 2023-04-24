import { invoke } from '@tauri-apps/api/tauri'

import Header from "./components/Header";
import Picker from "./components/Picker";
import Queue from "./components/Queue";
import { useEffect, useState } from 'react';

export type Path = {
  path: string;
  type: 'folder' | 'file';
}
function App() {
  const startingPath: Path = { path: '/', type: 'folder'}
  const [sourcePath, setSourcePath] = useState<Path>(startingPath) // file or folder
  const [destinationPath, setDestinationPath] = useState<Path>(startingPath) // folder

  useEffect(() => {
    invoke<string>('get_home_folder_path').then(pathString => {
      const path: Path = { path: pathString, type: 'folder' }
      setSourcePath(path)
      setDestinationPath(path)
    })
  }, [])

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
        </div>
        <Queue
          items={[]}
        />
      </div>
    </div>

  );
}

export default App;
