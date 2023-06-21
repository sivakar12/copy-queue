import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export default function useDrives() {
    const [drives, setDrives] = useState<string[]>([]);

    useEffect(() => {
        invoke<string[]>("get_drives").then((drives) => {
            console.log(drives)
            setDrives(drives);
        });
    }, []);
    return drives;
}