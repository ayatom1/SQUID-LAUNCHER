"use client";

import styles from "./SuccessModal.module.css";
import { CheckCircle } from "lucide-react";

export default function SuccessModal({ message, onClose }: { message: string, onClose: () => void }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.successModal}>
                <CheckCircle size={64} color="#00ff00" className={styles.successIcon} />
                <h2>PAYMENT SUCCESSFUL</h2>
                <p>{message}</p>
            </div>
        </div>
    );
}
