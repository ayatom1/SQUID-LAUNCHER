"use client";

import { useState } from "react";
import { useGames, Game, GameStatus } from "@/context/GameContext";
import styles from "./page.module.css";
import { Trash2, Plus, Image as ImageIcon, Eye, EyeOff, Pencil, Save, X } from "lucide-react";

export default function AdminPage() {
    const { games, addGame, removeGame, updateGame, toggleVisibility } = useGames();

    const initialFormState = {
        title: "",
        image: "",
        size: "10GB",
        version: "1.0.0",
        downloadUrl: "",
        price: 0,
        status: "not_installed" as GameStatus,
        isVisible: true,
    };

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        if (editingId) {
            // Update existing game
            const existingGame = games.find(g => g.id === editingId);
            if (existingGame) {
                updateGame({
                    ...existingGame,
                    ...formData,
                });
            }
            setEditingId(null);
        } else {
            // Add new game
            addGame({
                ...formData,
                lastPlayed: "Never",
            });
        }

        setFormData(initialFormState);
    };

    const handleEdit = (game: Game) => {
        setEditingId(game.id);
        setFormData({
            title: game.title,
            image: game.image || "",
            size: game.size || "",
            version: game.version || "1.0.0",
            downloadUrl: game.downloadUrl || "",
            price: game.price || 0,
            status: game.status,
            isVisible: game.isVisible,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Panel</h1>

            <div className={styles.grid}>
                {/* Add/Edit Game Form */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.subtitle}>{editingId ? 'Edit Game' : 'Add New Game'}</h2>
                        {editingId && (
                            <button onClick={cancelEdit} className={styles.cancelButton}><X size={16} /> Cancel</button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Game Title</label>
                            <input
                                className={styles.input}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Squid Game: The Challenge"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Image URL</label>
                            <input
                                className={styles.input}
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Size</label>
                                <input
                                    className={styles.input}
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    placeholder="e.g. 15GB"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Version</label>
                                <input
                                    className={styles.input}
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    placeholder="e.g. 1.0.2"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Download Link</label>
                            <input
                                className={styles.input}
                                value={formData.downloadUrl}
                                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                                placeholder="https://content.server.com/..."
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Price (GC)</label>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                />
                                <small className={styles.helperText}>Set to 0 for Free</small>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <select
                                    className={styles.select}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="installed">Installed</option>
                                    <option value="not_installed">Not Installed</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            {editingId ? <Save size={18} /> : <Plus size={18} />}
                            {editingId ? 'Update Game' : 'Add Game'}
                        </button>
                    </form>
                </div>

                {/* Game List */}
                <div className={styles.card}>
                    <h2 className={styles.subtitle}>Manage Games ({games.length})</h2>
                    <div className={styles.gameList}>
                        {games.length === 0 ? (
                            <p className={styles.empty}>No games available.</p>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className={`${styles.gameItem} ${!game.isVisible ? styles.hiddenItem : ''}`}>
                                    <div className={styles.gameInfo}>
                                        {game.image ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={game.image} alt={game.title} className={styles.gameThumb} />
                                        ) : (
                                            <div className={styles.gameThumbPlaceholder}>
                                                <ImageIcon size={16} />
                                            </div>
                                        )}
                                        <div>
                                            <div className={styles.gameTitle}>
                                                {game.title}
                                                {!game.isVisible && <span className={styles.hiddenTag}>(Hidden)</span>}
                                            </div>
                                            <div className={styles.gameMeta}>
                                                {game.size} • v{game.version || '1.0'} • {game.price > 0 ? `${game.price} GC` : 'Free'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.actions}>
                                        <button onClick={() => toggleVisibility(game.id, game.isVisible)} className={styles.iconButton} title={game.isVisible ? "Hide" : "Show"}>
                                            {game.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => handleEdit(game)} className={styles.iconButton} title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => removeGame(game.id)} className={`${styles.iconButton} ${styles.delete}`} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
