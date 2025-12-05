'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
    name: string;
    price: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (name: string) => void;
    updateQuantity: (name: string, change: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setCart(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                // Remove if already in cart (toggle)
                return prev.filter(i => i.name !== item.name);
            }
            // Add with quantity 1
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (name: string) => {
        setCart(prev => prev.filter(i => i.name !== name));
    };

    const updateQuantity = (name: string, change: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.name === name) {
                    const newQuantity = item.quantity + change;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
