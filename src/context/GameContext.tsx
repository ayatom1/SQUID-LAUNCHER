"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
    QuerySnapshot,
    DocumentData
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type GameStatus = "installed" | "not_installed";

export interface Game {
    id: string;
    title: string;
    image?: string;
    size?: string;
    status: GameStatus;
    lastPlayed?: string;
    // New Fields
    price: number;
    version: string;
    downloadUrl: string;
    isVisible: boolean;
}

interface GameContextType {
    games: Game[];
    addGame: (game: Omit<Game, "id">) => Promise<void>;
    removeGame: (id: string) => Promise<void>;
    updateGame: (game: Game) => Promise<void>;
    toggleVisibility: (id: string, currentVisibility: boolean) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [games, setGames] = useState<Game[]>([]);

    // Load from Firestore on mount
    useEffect(() => {
        const q = collection(db, "games");
        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const loadedGames: Game[] = [];
            snapshot.forEach((doc) => {
                loadedGames.push({ id: doc.id, ...doc.data() } as Game);
            });
            setGames(loadedGames);
        }, (error) => {
            console.error("Error fetching games:", error);
        });

        return () => unsubscribe();
    }, []);

    // Add Game to Cloud
    const addGame = async (game: Omit<Game, "id">) => {
        try {
            await addDoc(collection(db, "games"), game);
        } catch (e) {
            console.error("Error adding game: ", e);
            throw e;
        }
    };

    // Remove Game from Cloud
    const removeGame = async (id: string) => {
        try {
            await deleteDoc(doc(db, "games", id));
        } catch (e) {
            console.error("Error removing game: ", e);
            throw e;
        }
    };

    // Update Game in Cloud
    const updateGame = async (updatedGame: Game) => {
        try {
            const { id, ...data } = updatedGame;
            await updateDoc(doc(db, "games", id), data as any);
        } catch (e) {
            console.error("Error updating game: ", e);
            throw e;
        }
    };

    // Toggle Visibility
    const toggleVisibility = async (id: string, currentVisibility: boolean) => {
        try {
            await updateDoc(doc(db, "games", id), {
                isVisible: !currentVisibility
            });
        } catch (e) {
            console.error("Error toggling visibility: ", e);
            throw e;
        }
    };

    return (
        <GameContext.Provider value={{ games, addGame, removeGame, updateGame, toggleVisibility }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGames() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGames must be used within a GameProvider");
    }
    return context;
}
