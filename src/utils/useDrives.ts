import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Path } from "../types";

export default function useDrives() {
    const [drives, setDrives] = useState<Path[]>([]);

    useEffect(() => {
        invoke<Path[]>("get_drives").then((drives) => {
            console.log('drives', drives)
            setDrives(drives);
        });
    }, []);
    return drives;
}