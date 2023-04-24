import { invoke } from '@tauri-apps/api/tauri'

import Header from "./components/Header";
import Picker from "./components/Picker";
import Queue from "./components/Queue";
import { useEffect, useState } from 'react';

function App() {
  const [homeFolder, setHomeFolder] = useState<string>('/')
  
  useEffect(() => {}, [
    invoke<string>('get_home_folder_path').then(path => {
      setHomeFolder(path)
    })
  ])
  return (
    <div className="container mx-auto">
        <Header/>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Picker
            onChange={() => {}}
            label="source"
            value={homeFolder}
            directoryOnly={false}
          />
          <Picker
            onChange={() => {}}
            label="destination"
            value={homeFolder}
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
