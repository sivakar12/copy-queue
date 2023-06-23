export enum PathType {
  Folder = "folder",
  File = "file"
}
export type Path = {
  pathString: string;
  pathType: PathType
}

export enum CopyProgressType {
  Progress = "progress",
  Complete = "complete",
  Error = "error"
}

export type CopyProgress = {
  operationId: string;
  totalBytes: number;
  bytesCopied: number;
  copyProgressType: CopyProgressType
}

export enum OperationType {
  Copy = "copy",
  Move = "move",
  CreateFolder = "createFolder",
  Delete = "delete"
}

export type Operation = {
  id: string;
  source: Path;
  destination: Path;
  operationType: OperationType;
  splitOperations?: Operation[];
  isAtomic: boolean;
  totalBytes?: number;
  bytesCopied?: number;
  filesCopied?: number;
  totalFiles?: number;
};

export type Queue = {
  [id: string]: Operation;
}