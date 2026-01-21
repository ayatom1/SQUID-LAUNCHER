"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css"; // Reuse login styles
import Image from "next/image";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!email.includes("@")) {
            setError("Invalid email format.");
            return;
        }
        if (email.includes("example")) {
            setError("Restricted email domain.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create User Document
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                balance: 0, // Start with 0 GC
                ownedGames: [],
                createdAt: new Date().toISOString()
            });

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Registration failed.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logoWrapper}>
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className={styles.logo} />
                </div>
                <h1 className={styles.title}>NEW RECRUIT</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSignup} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="player@squid.game"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        REGISTER
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Already have an ID?</p>
                    <Link href="/login" className={styles.link}>Return to Login</Link>
                </div>
            </div>
        </div>
    );
}
