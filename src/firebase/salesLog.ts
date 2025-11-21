// Firebase Sales Log Services
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    Timestamp,
    limit
} from 'firebase/firestore';
import { db, firebaseConfigError } from './config';
import type { SaleLog } from '../types';

const ensureDb = () => {
    if (!db) {
        throw new Error(firebaseConfigError ?? 'Firebase is not configured. Please set the required environment variables.');
    }
    return db;
};

const getSalesLogCollection = () => collection(ensureDb(), 'sales_log');

// Log a sale
export const logSale = async (
    productId: string,
    productName: string,
    category: string,
    tags: string[],
    stockBefore: number,
    stockAfter: number
): Promise<void> => {
    await addDoc(getSalesLogCollection(), {
        productId,
        productName,
        category,
        tags,
        timestamp: Timestamp.now(),
        stockBefore,
        stockAfter
    });
};

// Get all sales logs (for admin)
export const getAllSalesLogs = async (): Promise<SaleLog[]> => {
    const q = query(getSalesLogCollection(), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
    })) as SaleLog[];
};

// Get recent sales logs
export const getRecentSalesLogs = async (limitCount: number = 50): Promise<SaleLog[]> => {
    const q = query(
        getSalesLogCollection(),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
    })) as SaleLog[];
};

// Get sales by category (for analytics)
export const getSalesByCategory = async (category: string): Promise<SaleLog[]> => {
    const q = query(
        getSalesLogCollection(),
        where('category', '==', category),
        orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
    })) as SaleLog[];
};

// Get sales by product
export const getSalesByProduct = async (productId: string): Promise<SaleLog[]> => {
    const q = query(
        getSalesLogCollection(),
        where('productId', '==', productId),
        orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
    })) as SaleLog[];
};

// Analytics: Get top selling products
export const getTopSellingProducts = async (): Promise<{ productName: string; count: number }[]> => {
    const allSales = await getAllSalesLogs();

    const productCounts: { [key: string]: number } = {};
    allSales.forEach(sale => {
        productCounts[sale.productName] = (productCounts[sale.productName] || 0) + 1;
    });

    return Object.entries(productCounts)
        .map(([productName, count]) => ({ productName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
};

// Analytics: Get sales by date range
export const getSalesByDateRange = async (startDate: Date, endDate: Date): Promise<SaleLog[]> => {
    const q = query(
        getSalesLogCollection(),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
    })) as SaleLog[];
};

// Analytics: Get total sales count
export const getTotalSalesCount = async (): Promise<number> => {
    const snapshot = await getDocs(getSalesLogCollection());
    return snapshot.size;
};

// Clear all sales logs (for admin - useful for clearing test data)
export const clearAllSalesLogs = async (): Promise<void> => {
    const snapshot = await getDocs(getSalesLogCollection());
    const deletePromises = snapshot.docs.map(docSnapshot =>
        deleteDoc(doc(ensureDb(), 'sales_log', docSnapshot.id))
    );
    await Promise.all(deletePromises);
};

