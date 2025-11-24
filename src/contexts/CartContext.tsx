// Cart Context - Global cart state management
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, Product } from '../types';
import {
    addToCart as addToCartFirebase,
    subscribeToCart,
    updateCartItemQuantity,
    removeFromCart,
    updateCartTimestamp,
    checkExpiredCarts
} from '../firebase/cart';
import { useToast } from '../components/ToastProvider';

interface CartContextType {
    cart: Cart | null;
    cartItemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addToCart: (product: Product) => Promise<void>;
    updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    timeRemaining: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate or retrieve session ID
const getSessionId = (): string => {
    let sessionId = localStorage.getItem('postro_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('postro_session_id', sessionId);
    }
    return sessionId;
};

// Format time remaining (e.g., "45:32")
const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return 'EXPIRED';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('60:00');
    const { addToast } = useToast();
    const sessionId = getSessionId();

    // Subscribe to cart changes
    useEffect(() => {
        const unsubscribe = subscribeToCart(sessionId, (updatedCart) => {
            setCart(updatedCart);
        });

        return () => unsubscribe();
    }, [sessionId]);

    // Update time remaining every second
    useEffect(() => {
        if (!cart?.expiresAt) return;

        const interval = setInterval(() => {
            setTimeRemaining(formatTimeRemaining(cart.expiresAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [cart?.expiresAt]);

    // Check for expired carts every 5 minutes
    useEffect(() => {
        const interval = setInterval(async () => {
            await checkExpiredCarts();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    // Calculate cart item count
    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const addToCart = async (product: Product) => {
        try {
            await addToCartFirebase(sessionId, product);
            addToast(`${product.name.toUpperCase()} • ADDED TO CART`);
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            if (error.message.includes('out of stock')) {
                addToast('OUT OF STOCK • TRY ANOTHER DROP');
            } else {
                addToast('ERROR • Failed to add to cart');
            }
            throw error;
        }
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        console.log(`Updating quantity for ${productId} to ${newQuantity}`);
        try {
            if (newQuantity <= 0) {
                // Quantity zero or negative: remove the item entirely
                await removeFromCart(sessionId, productId);
                addToast('ITEM REMOVED FROM CART');
                return;
            }
            await updateCartItemQuantity(sessionId, productId, newQuantity);
            console.log('Quantity updated successfully');
        } catch (error: any) {
            console.error('Error updating quantity:', error);
            if (error.message.includes('Not enough stock')) {
                addToast('NOT ENOUGH STOCK');
            } else {
                addToast('ERROR • Failed to update quantity');
            }
            throw error;
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await removeFromCart(sessionId, productId);
            addToast('ITEM REMOVED FROM CART');
        } catch (error) {
            console.error('Error removing item:', error);
            addToast('ERROR • Failed to remove item');
            throw error;
        }
    };

    // Update timestamp when cart closes
    useEffect(() => {
        if (!isCartOpen && cart && cart.items.length > 0) {
            updateCartTimestamp(sessionId).catch(console.error);
        }
    }, [isCartOpen, cart, sessionId]);

    return (
        <CartContext.Provider
            value={{
                cart,
                cartItemCount,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                updateQuantity,
                removeItem,
                timeRemaining
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
