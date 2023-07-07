import { useEffect, useState } from 'react'
import { Operation, OperationType, Path, PathType } from '../types';
import { invoke } from '@tauri-apps/api';

async function getTree(path: Path): Promise<Path[]> {
    return invoke<Path[]>('get_tree', { path })
}

export async function getSplitOperations(operation: Operation): Promise<Operation[]> {
    if (operation.source.pathType === PathType.File && operation.destination.pathType === PathType.Folder) {
      // TODO: Make it cross platform. 
      const destinationPath = operation.destination.pathString + '/' + operation.source.pathString.split('/').pop()
      const outputOperation: Operation = {
        id: operation.id,
        source: operation.source,
        destination: {
          pathString: destinationPath,
          pathType: PathType.File
        },
        operationType: OperationType.Copy,
        isAtomic: true
      }
      return [outputOperation]
    }

    if (operation.source.pathType === PathType.Folder && operation.destination.pathType === PathType.Folder) {
      const tree = await getTree(operation.source)
      const splitOperations: Operation[] = tree.map((treeItem, index) => {
          // TODO: use a cross platform path library
          const relativePath = treeItem.pathString.replace(operation.source.pathString, '')
          const folderName = operation.source.pathString.split('/').pop()
          const destinationFilePath = operation.destination.pathString + '/' + folderName + relativePath
          if (treeItem.pathType === PathType.Folder) {
            return {
              id: operation.id + '-' + index,
              source: treeItem,
              destination: {
                pathString: destinationFilePath,
                pathType: PathType.Folder
              },
              operationType: OperationType.CreateFolder,
              isAtomic: true
            }
          }
          if (treeItem.pathType === PathType.File) {
            return {
              id: operation.id + '-' + index,
              source: treeItem,
              destination: {
                pathString: destinationFilePath,
                pathType: PathType.File
              },
              operationType: OperationType.Copy,
              isAtomic: true,
              bytesCopied: 0,
              totalBytes: treeItem.size
            }
          }
          else {
            throw new Error('Unknown path type')
          }
        })
        return splitOperations;
    }

    throw new Error('Only file to folder and folder to folder are supported')
}