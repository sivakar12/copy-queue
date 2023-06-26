import { useEffect, useState } from 'react'
import { Operation, Path } from '../types';
import { invoke } from '@tauri-apps/api';

async function getTree(path: Path) {
    return invoke<Path[]>('get_tree', { path })
}
export async function getSplitOperations(operation: Operation) {
    const tree = await getTree(operation.source)
    const splitOperations = tree.map((path) => {
        const destinationFilePath = operation.destination.pathString + '/' + path.pathString.split('/').pop()
        return {
          ...operation,
          source: path,
          destination: {
            ...operation.destination,
            pathString: destinationFilePath
          }
        }
      })
    return splitOperations;
}