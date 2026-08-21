import React, { createContext, useContext, useState, useEffect } from "react";
import type { Costume } from "../types/costume";

interface CartItem {
  costume: Costume;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (costume: Costume) => void;
  removeFromCart: (costumeId: string) => void;
  updateQuantity: (costumeId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (costume: Costume) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.costume.id === costume.id,
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.costume.id === costume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { costume, quantity: 1 }];
    });
  };

  const removeFromCart = (costumeId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.costume.id !== costumeId),
    );
  };

  const updateQuantity = (costumeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(costumeId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.costume.id === costumeId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.costume.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
