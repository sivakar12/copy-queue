import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

import Picker from "./components/picker/Picker";
import Queue from "./components/queue/Queue";
import { useEffect, useRef, useState } from 'react';
import { 
  Path,
  Queue as QueueType,
  CopyProgress,
  Operation,
  PathType,
  OperationType,
  CopyProgressType, 
} from './types';
import { getSplitOperations } from './utils/splitOperations';
import Immutable, { set } from 'immutable';
import Button from './components/common/Button';

function App() {
  const startingPath: Path = { pathString: '/', pathType: PathType.Folder}
  const [sourcePath, setSourcePath] = useState<Path>(startingPath) // file or folder
  const [destinationPath, setDestinationPath] = useState<Path>(startingPath) // folder

  const [queue, setQueue] = useState<QueueType>(Immutable.Map());

  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue])

  // Get home folder path on loads
  useEffect(() => {
    invoke<Path>('get_home_folder_path').then(path => {
      setSourcePath(path)
      setDestinationPath(path)
    })
  }, [])

  const updateParentOperationProgress = (queue: QueueType, operationId: string) => {
    // TODO: Clean this up
    const operation = queue.get(operationId) as Operation
    const bytes = operation.splitOperations?.entrySeq().map(([_, splitOperation]) => {
      return splitOperation.bytesCopied || 0
    }).reduce((a, b) => a + b, 0)
    const totalBytes = operation.splitOperations?.entrySeq().map(([_, splitOperation]) => {
      return splitOperation.totalBytes || 0
    }).reduce((a, b) => a + b, 0)
    const filesCopied = operation.splitOperations?.entrySeq().map(([_, splitOperation]) => {
      return splitOperation.finished ? 1 : 0
    }).reduce((a, b) => a + b, 0)
    let newQueue = queue.setIn([operationId, 'bytesCopied'], bytes)
    newQueue = newQueue.setIn([operationId, 'totalBytes'], totalBytes)
    newQueue = newQueue.setIn([operationId, 'filesCopied'], filesCopied)
    console.log('new queue', newQueue.toJS())
    return newQueue
  }

  const handleProgressData =(copyProgressData: CopyProgress) => {

    const parentOperationId = copyProgressData.operationId.split('-')[0]
    let newQueue = queueRef.current;
    const path = [parentOperationId, 'splitOperations', copyProgressData.operationId]
    newQueue = newQueue.setIn([...path, 'bytesCopied'], copyProgressData.bytesCopied)
    newQueue = newQueue.setIn([...path, 'totalBytes'], copyProgressData.totalBytes)
    if (copyProgressData.copyProgressType === CopyProgressType.Complete) {
      newQueue = newQueue.setIn([...path, 'finished'], true)
    }
    
    newQueue = updateParentOperationProgress(newQueue, parentOperationId)
    setQueue(newQueue)
  
    if (copyProgressData.copyProgressType === CopyProgressType.Complete) {
      runOneOperationFromQueue()
    }
  }

  useEffect(() => {
    const unlisten = listen<CopyProgress>('file-copy-progress', (data) => {
      const copyProgrssData = data.payload;
      console.log('copy progress data', copyProgrssData)
      handleProgressData(copyProgrssData)
    })
    return () => { unlisten.then(u => u()) }
  }, [])

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
    let newQueue = queue.set(newOperation.id, newOperation)

    getSplitOperations(newOperation).then((splitOperations) => {
      const splitOperationsMap = Immutable.Map(splitOperations.map((splitOperation) => [splitOperation.id, splitOperation]))
      newQueue = newQueue.setIn([newOperation.id, 'splitOperations'], splitOperationsMap)
      const totalFiles = splitOperations.length
      newQueue = newQueue.setIn([newOperation.id, 'totalFiles'], totalFiles)
      newQueue = newQueue.setIn([newOperation.id, 'filesCopied'], 0)
      newQueue = updateParentOperationProgress(newQueue, newOperation.id)
      setQueue(newQueue)
    })
  }

  const runOneOperationFromQueue = async () => {
    console.log('queue', queueRef.current.toJS())
    // get all the split operations in a list
    const splitOperations: Operation[] = []
    // TODO: Write this in functional style
    queueRef.current.forEach((operation) => {
      if (operation.splitOperations) {
        operation.splitOperations.forEach((splitOperation) => {
          splitOperations.push(splitOperation)
        })
      }
    })
    // sort split operations by id which is a string
    const splitOperationsSorted = splitOperations.sort((a, b) => {
      if (a.id < b.id) {
        return -1
      } else if (a.id > b.id) {
        return 1
      } else {
        return 0
      }
    })
    // get the first non complete split operation
    const nonComplete = splitOperationsSorted.filter((splitOperation) =>  !splitOperation.finished)
    await invoke('run_atomic_operation', { operation: nonComplete[0] } )
  }

  const handleStart = () => {
    runOneOperationFromQueue()
  }

  return (
    <div className="container mx-auto h-screen flex p-4 gap-4">
      {/* First Column - Pickers and Add Button */}
      <div className="w-1/2 h-full flex flex-col space-y-4">
        <div className="min-h-0 flex-1">
          <Picker
            onChange={setSourcePath}
            label="Source"
            currentPath={sourcePath}
            foldersOnly={false}
          />
        </div>
        <div className="min-h-0 flex-1">
          <Picker
            onChange={setDestinationPath}
            label="Destination"
            currentPath={destinationPath}
            foldersOnly={true}
          />
        </div>
        <div className="flex justify-center space-x-2">
          <Button onClick={handleAdd} label='Copy' className="bg-emerald-700 hover:bg-emerald-800 text-white opacity-80"/>
          <Button onClick={() => {}} label='Move' className="bg-sky-700 hover:bg-sky-800 text-white opacity-80"/>
          <Button onClick={() => {}} label='Delete' className="bg-rose-700 hover:bg-rose-800 text-white opacity-80"/>
        </div>
      </div>
      
      {/* Second Column - Queue and Control Buttons */}
      <div className="w-1/2 h-full flex flex-col">
        <div className="flex-1">
          <Queue
            queue={queue}
          />
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <Button label="Start" onClick={handleStart} className="bg-indigo-700 hover:bg-indigo-800 text-white opacity-80"/>
          <Button label="Clear" onClick={() => {setQueue(Immutable.Map())}} className="bg-amber-800 hover:bg-amber-900 text-white opacity-80"/>
        </div>
      </div>
    </div>
  );
}

export default App;
