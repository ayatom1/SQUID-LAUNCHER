"use client";

import styles from "./page.module.css";
import { Play, Download, Image as ImageIcon, Lock, ShoppingCart } from "lucide-react";
import { useGames, Game } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/SuccessModal";

export default function Home() {
  const { games } = useGames();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter visible games
  const visibleGames = games.filter(g => g.isVisible !== false);

  const handleGameAction = async (game: Game) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (game.status === 'installed' || userData?.ownedGames?.includes(game.id)) {
      router.push("/library");
      return;
    }

    if (game.price > 0) {
      // Paid Game Logic
      if ((userData?.balance || 0) < game.price) {
        alert("Insufficient GrandCoins!");
        return;
      }

      // Process Purchase
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          balance: increment(-game.price),
          ownedGames: arrayUnion(game.id)
        });
        setSuccessMessage(`Purchased ${game.title} for ${game.price} GC`);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/library");
        }, 2000);
      } catch (error) {
        console.error("Purchase failed", error);
        alert("Transaction failed.");
      }
    } else {
      // Free Game Logic
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          ownedGames: arrayUnion(game.id)
        });
        setSuccessMessage(`${game.title} added to Library`);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/library");
        }, 2000);
      } catch (error) {
        console.error("Add to library failed", error);
      }
    }
  };

  const isOwned = (gameId: string) => {
    return userData?.ownedGames?.includes(gameId);
  };

  if (visibleGames.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Market</h1>
        </header>
        <div className={styles.emptyState}>
          <h2>No games available</h2>
          <p>Visit the Admin Panel to add new games.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showSuccess && <SuccessModal message={successMessage} onClose={() => setShowSuccess(false)} />}

      <header className={styles.header}>
        <h1 className={styles.title}>Market</h1>
        <div className={styles.filters}>
          <button className={`${styles.filterButton} ${styles.active}`}>All</button>
          <button className={styles.filterButton}>New Releases</button>
          <button className={styles.filterButton}>Top Sellers</button>
        </div>
      </header>

      <div className={styles.grid}>
        {visibleGames.map((game) => {
          const owned = isOwned(game.id);
          return (
            <div key={game.id} className={styles.cardWrapper} onClick={() => handleGameAction(game)}>
              {/* Glow Layer (Behind) */}
              <div
                className={styles.glowLayer}
                style={{ backgroundImage: `url(${game.image || '/logo.png'})` }}
              />

              {/* Main Card */}
              <div
                className={styles.card}
                style={{ backgroundImage: `url(${game.image || '/logo.png'})` }}
              >
                <div className={styles.cardOverlay}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>
                      {owned ? 'Owned' : (game.price > 0 ? `${game.price} GC` : 'Free')}
                    </span>

                    {!user ? (
                      <button className={styles.actionButton} style={{ background: '#333' }}>
                        <Lock size={16} color="#888" />
                      </button>
                    ) : (
                      <button
                        className={`${styles.actionButton} ${owned ? styles.playButton : styles.installButton
                          }`}
                      >
                        {owned ? <Play size={16} fill="currentColor" /> : (game.price > 0 ? <ShoppingCart size={16} /> : <Download size={16} />)}
                      </button>
                    )}

                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
