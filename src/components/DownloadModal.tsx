"use client";

import styles from "./DownloadModal.module.css";
import { Copy, Check, X } from "lucide-react";
import { useState } from "react";

interface DownloadModalProps {
    gameTitle: string;
    downloadUrl: string;
    onClose: () => void;
}

export default function DownloadModal({ gameTitle, downloadUrl, onClose }: DownloadModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(downloadUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Download {gameTitle}</h3>
                    <button onClick={onClose} className={styles.closeButton}><X size={20} /></button>
                </div>

                <div className={styles.modalBody}>
                    <p>Copy the link below to download the game installer:</p>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            value={downloadUrl || "https://launcher.squid/download/error"}
                            readOnly
                            className={styles.modalInput}
                        />
                        <button onClick={handleCopy} className={styles.copyButton}>
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                    <p className={styles.note}>Note: Ensure you have enough disk space logic.</p>
                </div>
            </div>
        </div>
    );
}
