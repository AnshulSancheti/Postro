// Product Grid Component - Main Product Display with Filtering
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { decreaseStock, getProduct } from '../firebase/products';
import { logSale } from '../firebase/salesLog';
import { useToast } from './ToastProvider';
import '../index.css';

interface ProductGridProps {
    products: Product[];
    searchTerm: string;
    activeCategory?: string;
    activeSubcategory?: string;
    onAddToCart?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    searchTerm,
    activeCategory,
    activeSubcategory,
    onAddToCart
}) => {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const { addToast } = useToast();


    // Filter products based on search and category
    useEffect(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(lowerSearch) ||
                product.tags.some(tag => tag.toLowerCase().includes(lowerSearch)) ||
                product.category.toLowerCase().includes(lowerSearch)
            );
        }

        // Filter by category
        if (activeCategory) {
            filtered = filtered.filter(product =>
                product.category === activeCategory
            );
        }

        // Filter by subcategory
        if (activeSubcategory) {
            filtered = filtered.filter(product =>
                product.subcategory === activeSubcategory
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, activeCategory, activeSubcategory]);

    const handleProductSelect = async (product: Product) => {
        if (product.stock === 0) return;

        // Optimistic UI could go here, but for now we just fire and forget
        try {
            // Get current product data to ensure we have latest stock
            const currentProduct = await getProduct(product.id);
            if (!currentProduct || currentProduct.stock === 0) {
                addToast('OUT OF STOCK • TRY ANOTHER DROP');
                return;
            }

            // Decrease stock
            await decreaseStock(product.id);

            // Log the sale
            await logSale(
                product.id,
                product.name,
                product.category,
                product.tags,
                currentProduct.stock,
                currentProduct.stock - 1
            );

            addToast(`${product.name.toUpperCase()} • ADDED TO CART`);
            onAddToCart?.(product);
        } catch (error) {
            console.error('Error selecting product:', error);
            addToast('ERROR • Failed to add item to cart');
        }
    };



    if (filteredProducts.length === 0) {
        return (
            <div className="product-grid-container">
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h2 className="empty-text">NO PRODUCTS FOUND</h2>
                    <p>Try adjusting your search or filters</p>
                </div>

                <style>{`
                    .empty-state {
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: var(--space-3xl);
                        background: var(--gray-light);
                        border: var(--border-chunky) dashed var(--black);
                    }

                    .empty-icon {
                        font-size: 4rem;
                        margin-bottom: var(--space-lg);
                    }

                    .empty-text {
                        font-family: var(--font-display);
                        font-size: 2rem;
                        color: var(--gray-mid);
                        margin-bottom: var(--space-md);
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="product-grid-container">
            <div className="products-count">
                <span className="tag tag-accent">{filteredProducts.length} PRODUCTS</span>
            </div>

            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={handleProductSelect}
                    />
                ))}
            </div>

            <style>{`
                .product-grid-container {
                    width: 100%;
                }

                .products-count {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: var(--space-lg);
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--space-xl);
                    width: 100%;
                    align-items: stretch;
                    grid-auto-rows: 1fr;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: var(--space-3xl);
                    background: var(--gray-light);
                    border: var(--border-chunky) dashed var(--black);
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: var(--space-lg);
                }

                .empty-text {
                    font-family: var(--font-display);
                    font-size: 2rem;
                    color: var(--gray-mid);
                    margin-bottom: var(--space-md);
                }

                @media (max-width: 1200px) {
                    .products-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 900px) {
                    .products-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: var(--space-lg);
                    }
                }

                @media (max-width: 600px) {
                    .products-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductGrid;
