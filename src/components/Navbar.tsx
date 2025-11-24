import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* --- MAIN NAVBAR --- */}
            <nav className="sticky top-0 z-40 w-full bg-[#F4F4F0] border-b-[3px] border-black px-4 py-4 flex items-center justify-between">

                <div className="flex items-center gap-4">
                    {/* HAMBURGER BUTTON (Left of Logo) */}
                    <button
                        onClick={toggleMenu}
                        className="group flex flex-col gap-1.5 p-2 border-2 border-transparent hover:border-black transition-all hover:bg-[#CCFF00] hover:shadow-[4px_4px_0px_0px_#000]"
                    >
                        <span className="block w-8 h-[3px] bg-black group-hover:rotate-12 transition-transform origin-left"></span>
                        <span className="block w-8 h-[3px] bg-black"></span>
                        <span className="block w-8 h-[3px] bg-black group-hover:-rotate-12 transition-transform origin-left"></span>
                    </button>

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2 select-none cursor-pointer">
                        <div className="bg-black text-white px-2 py-1 font-[Unbounded] font-black text-lg tracking-tighter transform -rotate-2">
                            postro
                        </div>
                        <span className="font-[Unbounded] font-black text-2xl tracking-tight">POSTRO</span>
                    </Link>
                </div>

                {/* RIGHT SIDE ACTIONS (Cart, etc.) */}
                <div className="flex items-center gap-4">
                    <button className="font-bold font-[Space_Grotesk] border-2 border-black px-4 py-1 hover:bg-black hover:text-[#CCFF00] transition-colors shadow-[3px_3px_0px_0px_#000]">
                        CART (0)
                    </button>
                </div>
            </nav>

            {/* --- SLIDE-OUT SIDEBAR (OVERLAY) --- */}
            {/* Dark Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleMenu}
            />

            {/* Sidebar Content */}
            <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-[#F4F4F0] border-r-[3px] border-black z-50 transform transition-transform duration-300 ease-out shadow-[10px_0px_0px_0px_rgba(0,0,0,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Close Button */}
                <div className="p-4 flex justify-end">
                    <button onClick={toggleMenu} className="p-2 border-2 border-black hover:bg-[#FF0099] hover:text-white transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* CATEGORIES SECTION */}
                <div className="px-6 pb-8 overflow-y-auto h-full">
                    <h2 className="font-[Unbounded] text-3xl font-black uppercase mb-2">Categories</h2>
                    <div className="w-full h-[3px] bg-black mb-6"></div>

                    <ul className="flex flex-col gap-4">
                        {['ALL PRODUCTS', 'ANIME POSTERS+', 'MOVIE POSTERS+', 'CAR POSTERS+', 'BIKE POSTERS+', 'STICKERS+'].map((category, index) => (
                            <li key={index}>
                                <button
                                    className={`w-full text-left px-4 py-3 font-[Unbounded] font-bold uppercase border-[3px] border-black text-sm tracking-wide transition-all
                      ${index === 0 ? 'bg-[#CCFF00] shadow-[5px_5px_0px_0px_#000] hover:translate-x-1' : 'bg-white shadow-[3px_3px_0px_0px_#000] hover:bg-[#CCFF00] hover:translate-x-1 hover:shadow-[5px_5px_0px_0px_#000]'}
                    `}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-12 p-4 border-2 border-black bg-black text-white text-center">
                        <p className="font-[Space_Grotesk] text-xs uppercase mb-2">Street Art for Your Walls</p>
                        <p className="font-[Unbounded] text-yellow-400">© 2024 POSTRO</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
