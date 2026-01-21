"use client";

import { useEffect, useState } from "react";
import styles from "./UpdateOverlay.module.css";
import { Download, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import packageJson from "../../package.json";

interface ReleaseData {
    tag_name: string;
    assets: { browser_download_url: string; name: string }[];
    body: string;
}

export default function UpdateOverlay() {
    const [status, setStatus] = useState<"CHECKING" | "AVAILABLE" | "DOWNLOADING" | "READY" | "NONE">("NONE");
    const [release, setRelease] = useState<ReleaseData | null>(null);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [installerPath, setInstallerPath] = useState("");

    useEffect(() => {
        checkUpdates();

        if (window.electron) {
            window.electron.receive("download-progress", (percent: number) => {
                setProgress(percent);
            });
            window.electron.receive("download-complete", (path: string) => {
                setInstallerPath(path);
                setStatus("READY");
            });
            window.electron.receive("download-error", (msg: string) => {
                console.error(msg);
                alert("Download Failed: " + msg);
                setStatus("AVAILABLE"); // Retry allowed
            });
        }
    }, []);

    const checkUpdates = async () => {
        setStatus("CHECKING");
        try {
            const res = await fetch("https://api.github.com/repos/ayatom1/SQUID-LAUNCHER/releases/latest");
            if (!res.ok) throw new Error("Failed to check updates");

            const data: ReleaseData = await res.json();
            const latestVersion = data.tag_name.replace("v", "");
            const currentVersion = packageJson.version;

            if (latestVersion !== currentVersion) {
                setRelease(data);
                const asset = data.assets.find(a => a.name.endsWith(".exe")) || data.assets[0];
                setDownloadUrl(asset?.browser_download_url || "");
                setStatus("AVAILABLE");
            } else {
                setStatus("NONE");
            }
        } catch (e) {
            console.error("Update Check Failed", e);
            setStatus("NONE");
        }
    };

    const startDownload = async () => {
        if (!downloadUrl) return;
        setStatus("DOWNLOADING");
        setProgress(0);

        if (window.electron) {
            window.electron.send("download-update", downloadUrl);
        } else {
            // Fallback for browser testing
            alert("Auto-Update only works in Desktop App. Opening browser...");
            window.open(downloadUrl, '_blank');
            setStatus("AVAILABLE");
        }
    };

    const handleRestart = () => {
        if (window.electron && installerPath) {
            window.electron.send("install-update", installerPath);
        } else {
            alert("Installer path missing.");
        }
    };

    if (status === "NONE") return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>SYSTEM UPDATE</h2>
                    <div className={styles.versionBadge}>v{release?.tag_name}</div>
                </div>

                <div className={styles.content}>
                    {status === "CHECKING" && (
                        <div className={styles.statusRow}>
                            <RefreshCw className={styles.spin} size={24} />
                            <span>Connecting to Mothership...</span>
                        </div>
                    )}

                    {status === "AVAILABLE" && (
                        <>
                            <div className={styles.notes}>
                                <h3>New Content Detected!</h3>
                                <p>{release?.body || "Bug fixes and performance improvements."}</p>
                            </div>
                            <button className={styles.actionButton} onClick={startDownload}>
                                <Download size={20} />
                                DOWNLOAD UPDATE
                            </button>
                            <p className={styles.warning}>Updates are mandatory for security.</p>
                        </>
                    )}

                    {status === "DOWNLOADING" && (
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                            </div>
                            <span className={styles.progressText}>{Math.round(progress)}%</span>
                            <p style={{ color: '#666', marginTop: '8px' }}>Downloading from secure server...</p>
                        </div>
                    )}

                    {status === "READY" && (
                        <div className={styles.readyContainer}>
                            <CheckCircle size={48} color="#00ff00" className={styles.successIcon} />
                            <h3>Update Ready to Install</h3>
                            <button className={`${styles.actionButton} ${styles.restartBtn}`} onClick={handleRestart}>
                                <RefreshCw size={20} />
                                INSTALL & RESTART
                            </button>
                            <p className={styles.warning}>Launcher will close to run the setup wizard.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
