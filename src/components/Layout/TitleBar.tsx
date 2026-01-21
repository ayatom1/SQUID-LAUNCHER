"use client";

import { X, Minus, Square } from "lucide-react";
import styles from "./TitleBar.module.css";
import { useState } from "react";

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    const handleControl = (action: string) => {
        if (typeof window !== "undefined" && (window as any).electron) {
            (window as any).electron.send("window-control", action);
            if (action === "maximize") {
                setIsMaximized(!isMaximized);
            }
        }
    };

    return (
        <div className={styles.titleBar}>
            <div className={styles.dragRegion} />
            <div className={styles.title}>Squid Launcher</div>
            <div className={styles.controls}>
                <button
                    className={styles.button}
                    onClick={() => handleControl("minimize")}
                >
                    <Minus size={16} />
                </button>
                <button
                    className={styles.button}
                    onClick={() => handleControl("maximize")}
                >
                    <Square size={14} />
                </button>
                <button
                    className={`${styles.button} ${styles.close}`}
                    onClick={() => handleControl("close")}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
