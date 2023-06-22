export type Path = {
  path: string;
  type: 'folder' | 'file';
}

export type CopyProgress = {
  id: string;
  totalBytes: number;
  bytesCopied: number;
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

export type Queue = {
  [id: string]: QueueItem;
}

export type FolderContentItem = {
    name: string;
    isFolder: boolean;
}