"use client";

import styles from "./page.module.css";
import { Trash2, Monitor, Globe, Info } from "lucide-react";

export default function Settings() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Globe size={20} />
                    General
                </h2>
                <div className={styles.settingItem}>
                    <div className={styles.label}>
                        <span>Language</span>
                        <span className={styles.description}>Select your preferred language</span>
                    </div>
                    <select className={styles.select} disabled value="en">
                        <option value="en">English (US)</option>
                    </select>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Monitor size={20} />
                    Performance
                </h2>
                <div className={styles.settingItem}>
                    <div className={styles.label}>
                        <span>Performance Mode</span>
                        <span className={styles.description}>Adjust visual effects for better performance</span>
                    </div>
                    <div className={styles.options}>
                        <button className={styles.optionButton}>Low</button>
                        <button className={`${styles.optionButton} ${styles.active}`}>Medium</button>
                        <button className={styles.optionButton}>High</button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Trash2 size={20} />
                    Storage
                </h2>
                <div className={styles.settingItem}>
                    <div className={styles.label}>
                        <span>Clear Cache</span>
                        <span className={styles.description}>Free up space by removing temporary files</span>
                    </div>
                    <button className={styles.dangerButton}>
                        Clear Cache
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Info size={20} />
                    About
                </h2>
                <div className={styles.aboutCard}>
                    <h3>Squid Launcher</h3>
                    <p>Version 1.0.0 (Beta)</p>
                    <p className={styles.copyright}>© 2026 Squid Industries</p>
                </div>
            </div>
        </div>
    );
}
