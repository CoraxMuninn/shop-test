"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateCartQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToRecentlyViewed: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("lebaszir_cart");
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem("lebaszir_wishlist");
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedRecent = localStorage.getItem("lebaszir_recent");
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("lebaszir_cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("lebaszir_wishlist", JSON.stringify(wishlist));
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("lebaszir_recent", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      const qty = newItem.quantity ?? 1;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }

      return [...prev, { ...newItem, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.productId === productId && item.color === color && item.size === size)
      )
    );
  };

  const updateCartQuantity = (productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10); // Keep last 10
    });
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        searchModalOpen,
        setSearchModalOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addToRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
