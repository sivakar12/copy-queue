import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

import Picker from "./components/picker/Picker";
import Queue from "./components/queue/Queue";
import { useEffect, useState } from 'react';
import { Path, Queue as QueueType, CopyProgress, Operation, PathType, OperationType } from './types';
import { getSplitOperations } from './utils/splitOperations';

function Button({ onClick, label }: { onClick: () => void, label: string }) {
  return (
    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded inline-block" onClick={onClick}>
      {label}
    </div>
  )
}


function App() {
  const startingPath: Path = { pathString: '/', pathType: PathType.Folder}
  const [sourcePath, setSourcePath] = useState<Path>(startingPath) // file or folder
  const [destinationPath, setDestinationPath] = useState<Path>(startingPath) // folder

  const [queue, setQueue] = useState<QueueType>({});

  useEffect(() => {
    invoke<Path>('get_home_folder_path').then(path => {
      setSourcePath(path)
      setDestinationPath(path)
    })
  }, [])

  useEffect(() => {
    const unlisten = listen<CopyProgress>('file-copy-progress', (data) => {
      const copyProgrssData = data.payload;
      console.log('copy progress data', copyProgrssData)
      
      setQueue((prevQueue) => {
        const queueItem = prevQueue[copyProgrssData.operationId]
        const newQueueItem = {
          ...queueItem,
          totalBytes: copyProgrssData.totalBytes,
          bytesCopied: copyProgrssData.bytesCopied,
        }
        return {
          ...prevQueue,
          [copyProgrssData.operationId]: newQueueItem
        }
      })
    })
    return () => { unlisten.then(u => u()) }
  }, [])

  useEffect(() => {
    for (const operation of Object.values(queue)) {
      if (!operation.splitOperations || ! operation.splitOperations.length) {
        getSplitOperations(operation).then(splitOperations => {
          const previousQueueItem = queue[operation.id]
          const newQueueItem = {
            ...previousQueueItem,
            splitOperations
          }
          setQueue({
            ...queue,
            [operation.id]: newQueueItem
          })
        })
      }
    }
  }, [queue])

  const handleAdd = () => {
    // TODO: What is a better id string?
    const timestampString = new Date().getTime().toString()
    const newOperation: Operation = {
      id: timestampString,
      source: sourcePath,
      destination: destinationPath,
      operationType: OperationType.Copy,
      isAtomic: true,     // TODO: This is for testing only
    }
    setQueue({
      ...queue,
      [newOperation.id]: newOperation
    })
  }

  const handleStartCopying = () => {
    // This copies only the first item in the queue for now.
    const firstItem = Object.values(queue)[0]
    const destinationFilePath = destinationPath.pathString + '/' + firstItem.source.pathString.split('/').pop()

    invoke('copy_one_file', {
      operation: {
        ...firstItem,
        destination: {
          ...firstItem.destination,
          pathString: destinationFilePath
        } 
      }
    })
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 grid-rows-2 grid-gap-2">
        <div className="">
          <Picker
            onChange={setSourcePath}
            label="Source Picker"
            currentPath={sourcePath}
            foldersOnly={false}
          />
          <Picker
            onChange={setDestinationPath}
            label="Destination Picker"
            currentPath={destinationPath}
            foldersOnly={true}
          />
        </div>
        <div className="">
          <Queue
            queue={queue}
          />
        </div>
        <div className="self-right">
          <Button onClick={handleAdd} label='Add'/>
        </div>
        <div className="">
            <Button label="Start Copying" onClick={handleStartCopying}/>
            <Button label="Clear All" onClick={() => {setQueue({})}}/>
        </div>
      </div>
      </div>
  );
}

export default App;
