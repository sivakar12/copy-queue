import Immutable from "immutable";

export enum PathType {
  Folder = "folder",
  File = "file"
}
export type Path = {
  pathString: string,
  pathType: PathType,
  size?: number
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
  splitOperations?: Immutable.Map<string, Operation>;
  isAtomic: boolean;
  totalBytes?: number;
  bytesCopied?: number;
  filesCopied?: number;
  totalFiles?: number;
  finished?: boolean;
};

export type Queue = Immutable.Map<string, Operation>;