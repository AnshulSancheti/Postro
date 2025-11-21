// Home Page - Main Product Showcase
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import HeroCarousel from '../components/HeroCarousel';
import Marquee from '../components/Marquee';
import { subscribeToProducts } from '../firebase/products';
import type { Product } from '../types';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<{ product: Product; addedAt: Date }[]>([]);

  // Subscribe to real-time product updates
  useEffect(() => {
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (category: string, subcategory?: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory || '');
  };

  // Hero carousel slides
  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80',
      title: 'CARS COLLECTION',
      subtitle: 'Garage-worthy prints for petrolheads • Precision-detailed • Ready to frame',
      cta: 'SHOP CARS'
    },
    {
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1600&q=80',
      title: 'ANIME COLLECTION',
      subtitle: 'S-ranked posters for every shounen arc • Limited drops weekly',
      cta: 'SHOP ANIME'
    },
    {
      image: 'https://images.unsplash.com/photo-1463107971871-fbac9ddb920f?auto=format&fit=crop&w=1600&q=80',
      title: 'MOVIE COLLECTION',
      subtitle: 'Cinematic icons, remastered for your wall • Noir to neon palettes',
      cta: 'SHOP MOVIES'
    }
  ];

  const handleAddToCart = (product: Product) => {
    setOrders((prev) => [{ product, addedAt: new Date() }, ...prev].slice(0, 6));
  };

  return (
    <div className="min-h-screen bg-main text-dark">
      <Header />

      <HeroCarousel slides={heroSlides} />
      <Marquee className="border-t-0" />

      <section className="border-b-[3px] border-dark bg-surface/70 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
          <div className="rounded-none border-[3px] border-dark bg-surface p-6 shadow-hard sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.5em] text-dark/50">SCAN THE STACK</p>
                <h3 className="font-display text-3xl font-black uppercase tracking-tight">FIND YOUR POSTER</h3>
              </div>
              <div className="w-full sm:max-w-md">
                <SearchBar onSearch={setSearchTerm} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-0">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.6em] text-dark/40">POSTRO SELECTION</p>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">ALL PRODUCTS</h2>
            <div className="flex w-full max-w-md items-center gap-3 text-dark">
              <span className="h-[3px] flex-1 bg-dark" />
              <span className="text-xs font-bold uppercase tracking-[0.5em]">CURATED</span>
              <span className="h-[3px] flex-1 bg-dark" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-32">
              <CategoryFilter
                onCategoryChange={handleCategoryChange}
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
              />
            </aside>
            <div>
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center border-[3px] border-dashed border-dark bg-surface text-center shadow-hard">
                  <span className="font-display text-3xl uppercase tracking-tight text-dark/40">LOADING</span>
                  <span className="text-xs font-bold uppercase tracking-[0.5em] text-dark/40">SYNCING INVENTORY</span>
                </div>
              ) : (
                <ProductGrid
                  products={products}
                  searchTerm={searchTerm}
                  activeCategory={activeCategory}
                  activeSubcategory={activeSubcategory}
                  onAddToCart={handleAddToCart}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-[3px] border-dark bg-surface/80 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-0">
          <div className="rounded-none border-[3px] border-dark bg-main p-6 shadow-hard">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.5em] text-dark/40">Live Queue</p>
                <h3 className="font-display text-3xl font-black uppercase tracking-tight text-dark">Orders & Cart</h3>
              </div>
            </div>
            {orders.length === 0 ? (
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-dark/40">No items yet. Tap “Add to cart” to start the queue.</p>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((entry, index) => (
                  <div
                    key={`${entry.product.id}-${entry.addedAt.getTime()}-${index}`}
                    className="flex flex-col gap-3 border-[3px] border-dark bg-surface p-4 shadow-hard"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.4em] text-dark/50">
                      {entry.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h4 className="font-display text-xl font-black uppercase tracking-tight text-dark">{entry.product.name}</h4>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dark/60">
                      {entry.product.category} • {entry.product.type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t-[3px] border-dark bg-dark py-8 text-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-xs font-bold uppercase tracking-[0.5em] sm:flex-row sm:justify-between sm:px-6 lg:px-0">
          <span>POSTRO © 2025</span>
          <span>STAY ACID • STAY BOLD</span>
          <span>POSTRO.IN</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
