import { invoke } from '@tauri-apps/api/tauri'

import Header from "./components/Header";
import Picker from "./components/Picker";
import Queue from "./components/Queue";
import { useEffect, useState } from 'react';

function App() {
  const [sourcePath, setSourcePath] = useState<string>('/')
  const [destinationPath, setDestinationPath] = useState<string>('/')

  useEffect(() => {
    invoke<string>('get_home_folder_path').then(path => {
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
            directoryOnly={false}
          />
          <Picker
            onChange={setDestinationPath}
            label="destination"
            currentPath={destinationPath}
            directoryOnly={true}
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
