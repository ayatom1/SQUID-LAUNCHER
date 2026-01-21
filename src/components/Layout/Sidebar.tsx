"use client";

import { Home, Library, Settings, User, ShieldAlert, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, userData, logout } = useAuth();

    const navItems = [
        { name: "Market", icon: Home, path: "/" },
        { name: "Library", icon: Library, path: "/library" },
        { name: "Settings", icon: Settings, path: "/settings" },
        { name: "Admin Panel", icon: ShieldAlert, path: "/admin" },
    ];

    return (
        <aside className={styles.sidebar}>
            {/* Logo - Text Removed, Image Enlarged */}
            <div className={styles.logoWrapper}>
                <div className={styles.logoContainer}>
                    <Image src="/logo.png" alt="Logo" width={140} height={140} className={styles.logo} />
                </div>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                        >
                            <item.icon
                                size={20}
                                className={styles.icon}
                            />
                            <span className={styles.label}>{item.name}</span>
                            {isActive && <div className={styles.indicator} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Account Card with Balance Inside */}
            <div className={styles.accountWrapper}>
                {user ? (
                    <div className={styles.accountCard} onClick={logout} title="Click to Logout">
                        <div className={styles.accountLeft}>
                            <div className={styles.avatar}>
                                <User size={20} />
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>
                                    {userData?.email?.split('@')[0] || "Player"}
                                </span>
                                <span className={styles.userStatus}>Online</span>
                            </div>
                        </div>

                        {/* Balance on the Right */}
                        <div className={styles.balanceBadge}>
                            <Image src="/gc_logo.png" alt="GC" width={16} height={16} className={styles.coinIcon} />
                            <span className={styles.balanceAmount}>{userData?.balance || 0}</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.accountCard} onClick={() => router.push('/login')}>
                        <div className={styles.accountLeft}>
                            <div className={styles.avatar}>
                                <LogIn size={20} />
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>Guest</span>
                                <span className={styles.userStatus}>Login to Play</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
