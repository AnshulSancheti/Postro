import { motion } from 'framer-motion';
import type { FC } from 'react';

interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

const HeroCarousel: FC<HeroCarouselProps> = ({ slides }) => (
  <section className="border-b-[3px] border-dark bg-main py-10">
    <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-0">
      {slides.map((slide, index) => (
        <motion.div
          key={slide.title}
          className="relative flex min-h-[360px] flex-col justify-between overflow-hidden border-[3px] border-dark bg-dark shadow-hard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-dark/10 backdrop-blur-[2px]" />
          <div className="relative z-10 flex h-full flex-col justify-between bg-dark/50 p-6 text-surface backdrop-blur-[2px]">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.6em] text-primary/70">Postro Drop</p>
              <h2 className="font-display text-3xl font-black uppercase tracking-tight leading-[0.9]">
                {slide.title}
              </h2>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-surface/80">
                {slide.subtitle}
              </p>
            </div>
            {slide.cta && (
              <motion.button
                type="button"
                className="mt-6 inline-flex items-center justify-between border-[3px] border-primary bg-primary px-5 py-3 text-xs font-black uppercase tracking-[0.4em] text-dark"
                whileHover={{ x: -4, y: -4, boxShadow: '8px 8px 0px 0px #0D0D0D' }}
                whileTap={{ x: 0, y: 0, boxShadow: '0px 0px 0px 0px #0D0D0D' }}
              >
                {slide.cta}
                <span className="text-lg">↗</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HeroCarousel;
