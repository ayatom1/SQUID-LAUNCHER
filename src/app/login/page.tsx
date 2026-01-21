"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err: any) {
            setError("Invalid credentials. Try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logoWrapper}>
                    <Image src="/logo.png" alt="Logo" width={100} height={100} className={styles.logo} />
                </div>
                <h1 className={styles.title}>PLAYER LOGIN</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
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
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        ENTER GAME
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Don't have an ID?</p>
                    <Link href="/signup" className={styles.link}>No, I don't have an account</Link>
                </div>
            </div>
        </div>
    );
}
