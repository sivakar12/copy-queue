import { invoke } from "@tauri-apps/api";
import { Operation } from "../types";

export default async function(inputOperation: Operation): Promise<Operation[]> {
    const results: Operation[] = await invoke<Operation[]>("split_work", inputOperation)
    return results;
}