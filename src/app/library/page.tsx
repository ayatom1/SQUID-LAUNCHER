"use client";

import styles from "./page.module.css";
import { Play, Image as ImageIcon } from "lucide-react";
import { useGames } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import DownloadModal from "@/components/DownloadModal";

export default function Library() {
    const { games } = useGames();
    const { userData } = useAuth();
    const [selectedGame, setSelectedGame] = useState<any>(null);

    // Filter games owned by user
    const installedGames = games.filter(g =>
        userData?.ownedGames?.includes(g.id) || g.status === 'installed'
    );

    if (installedGames.length === 0) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Library</h1>
                <div className={styles.empty}>
                    <p>No games owned. Visit the Market to add games.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {selectedGame && (
                <DownloadModal
                    gameTitle={selectedGame.title}
                    downloadUrl={selectedGame.downloadUrl}
                    onClose={() => setSelectedGame(null)}
                />
            )}

            <h1 className={styles.title}>Library</h1>
            <div className={styles.list}>
                {installedGames.map((game) => (
                    <div key={game.id} className={styles.item}>
                        <div className={styles.gameInfo}>
                            <div className={styles.iconPlaceholder}>
                                {game.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={game.image} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                ) : (
                                    <ImageIcon size={24} color="#444" />
                                )}
                            </div>
                            <div>
                                <h3 className={styles.gameTitle}>{game.title}</h3>
                                <div className={styles.meta}>
                                    <span>{game.size || 'N/A'}</span>
                                    <span className={styles.separator}>•</span>
                                    <span>v{game.version || '1.0'}</span>
                                </div>
                            </div>
                        </div>
                        <button className={styles.playButton} onClick={() => setSelectedGame(game)}>
                            <Play size={16} fill="currentColor" />
                            Install / Play
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
