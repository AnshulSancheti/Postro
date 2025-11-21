import type { FC } from 'react';

interface StockBadgeProps {
    stock: number;
    lowStockThreshold?: number;
}

const StockBadge: FC<StockBadgeProps> = ({ stock, lowStockThreshold = 5 }) => {
    const getStockStatus = () => {
        if (stock === 0) return 'SOLD OUT';
        if (stock <= lowStockThreshold) return `${stock} LEFT`;
        return `${stock} IN STOCK`;
    };

    const status = getStockStatus();
    const badgeTone = stock === 0 ? 'bg-accent text-main' : stock <= lowStockThreshold ? 'bg-secondary text-main' : 'bg-primary text-dark';

    return (
        <span className={`inline-flex rounded-none border-[3px] border-dark px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] shadow-hard ${badgeTone}`}>
            {status}
        </span>
    );
};

export default StockBadge;
