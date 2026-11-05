import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppScreen } from '../types/robot';
import {
  SSU_GALLERY_PHOTOS,
  GalleryPhoto,
  GalleryCategory
} from '../data/galleryData';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  Grid,
  X,
  SlidersHorizontal,
  Menu
} from 'lucide-react';

interface PhotoGalleryScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onOpenMenu?: () => void;
  onSpeakText?: (text: string) => void;
}

export const PhotoGalleryScreen: React.FC<PhotoGalleryScreenProps> = ({
  onNavigate,
  onOpenMenu,
  onSpeakText
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenLightbox, setIsFullscreenLightbox] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Filtered photos
  const filteredPhotos: GalleryPhoto[] = React.useMemo(() => {
    if (selectedCategory === 'all') return SSU_GALLERY_PHOTOS;
    return SSU_GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Keep index in bounds when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const activePhoto = filteredPhotos[currentIndex] || filteredPhotos[0];

  // Next / Previous Navigation
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  }, [filteredPhotos.length]);

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext]);

  // Touchscreen Swipe Support for 10-inch Tablet
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = (touchStartYRef.current || 0) - touchEndY;

    // Detect horizontal swipe if deltaX is larger than deltaY and > 45px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsFullscreenLightbox(false);
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const categories: Array<{ id: GalleryCategory; label: string; count: number }> = [
    { id: 'all', label: 'All Photos', count: SSU_GALLERY_PHOTOS.length },
    {
      id: 'aerial',
      label: 'Aerial Views',
      count: SSU_GALLERY_PHOTOS.filter((p) => p.category === 'aerial').length
    },
    {
      id: 'academic',
      label: 'Academic & Labs',
      count: SSU_GALLERY_PHOTOS.filter((p) => p.category === 'academic').length
    },
    {
      id: 'facilities',
      label: 'Hostels & Facilities',
      count: SSU_GALLERY_PHOTOS.filter((p) => p.category === 'facilities').length
    },
    {
      id: 'greenery',
      label: 'Campus Greenery',
      count: SSU_GALLERY_PHOTOS.filter((p) => p.category === 'greenery').length
    },
    {
      id: 'events',
      label: 'Events & Convocations',
      count: SSU_GALLERY_PHOTOS.filter((p) => p.category === 'events').length
    }
  ];

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col justify-between p-3 sm:p-4 lg:p-5 font-sans select-none overflow-hidden relative">
      {/* ======================================================== */}
      {/* 1. TOP HEADER: Navy Blue Bar (#263746)                   */}
      {/* ======================================================== */}
      <header className="relative z-20 flex items-center justify-between bg-[#263746] text-white px-3 sm:px-5 py-2.5 rounded-xl border border-[#E9EDF2]/20 shadow-sm shrink-0">
        {/* Left: Back Button & Menu Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onSpeakText) onSpeakText("Returning to Campus Hub.");
              onNavigate('hub');
            }}
            className="group flex items-center gap-2 px-3 sm:px-3.5 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98"
            title="Return to Campus Hub"
          >
            <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-[#E9EDF2]/70 block uppercase tracking-wider">
                Hub
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white">
                Campus Hub
              </span>
            </div>
          </button>

          {onOpenMenu && (
            <button
              onClick={onOpenMenu}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98"
              title="Open Complete Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#C49A45]" />
              <span className="text-xs font-semibold hidden md:inline">Menu</span>
            </button>
          )}
        </div>

        {/* Center Title */}
        <div className="flex items-center gap-2 sm:gap-3 text-center">
          <img
            src="/robotics-club-logo.jpg"
            alt="SSU Logo"
            className="w-9 h-9 rounded-full border border-white/20 object-cover hidden sm:block"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                Sri Sri University Photo Gallery
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-semibold">
                {filteredPhotos.length} Photos
              </span>
            </div>
            <p className="text-[12px] text-[#E9EDF2]/80 mt-0.5 hidden sm:block">
              Authentic Campus Photography • Touchscreen Swipe Enabled
            </p>
          </div>
        </div>

        {/* Right Controls: Mode Toggle, Slideshow & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Slideshow Play/Pause */}
          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              isAutoPlaying
                ? 'bg-[#C49A45] border-[#C49A45] text-white'
                : 'bg-[#30343B] hover:bg-[#202124] border-white/10 text-[#E9EDF2]'
            }`}
            title={isAutoPlaying ? 'Pause Slideshow' : 'Start Auto Slideshow'}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAutoPlaying ? 'Playing' : 'Slideshow'}</span>
          </button>

          {/* Grid vs Carousel View Toggle */}
          <button
            onClick={() => setViewMode((prev) => (prev === 'carousel' ? 'grid' : 'carousel'))}
            className={`p-2.5 min-h-[44px] min-w-[44px] rounded-lg border flex items-center justify-center transition-all shadow-sm ${
              viewMode === 'grid'
                ? 'bg-[#C49A45] border-[#C49A45] text-white'
                : 'bg-[#30343B] hover:bg-[#202124] border-white/10 text-[#E9EDF2]'
            }`}
            title={viewMode === 'grid' ? 'Switch to Carousel' : 'Switch to Grid'}
          >
            {viewMode === 'grid' ? <SlidersHorizontal className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>

          {/* Open Full-screen Lightbox */}
          <button
            onClick={() => setIsFullscreenLightbox(true)}
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white flex items-center justify-center transition-all shadow-sm active:scale-98"
            title="Expand Full Screen"
          >
            <Maximize2 className="w-4 h-4 text-[#C49A45]" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. CATEGORY FILTER TABS                                  */}
      {/* ======================================================== */}
      <div className="flex items-center gap-1.5 sm:gap-2 my-2 overflow-x-auto no-scrollbar shrink-0 py-0.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 min-h-[38px] shadow-xs active:scale-98 ${
                isActive
                  ? 'bg-[#263746] text-white border border-[#263746]'
                  : 'bg-white text-[#606B76] hover:text-[#30343B] hover:bg-white/80 border border-[#D8DFE8]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#C49A45] text-white' : 'bg-[#E9EDF2] text-[#606B76]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN GALLERY DISPLAY                                  */}
      {/* ======================================================== */}
      {viewMode === 'carousel' ? (
        /* ================= CAROUSEL VIEW ================= */
        <div className="flex-1 w-full flex flex-col justify-between overflow-hidden relative min-h-0">
          {/* Main Photo Canvas with Swipe Detection */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 w-full bg-[#202124] rounded-xl overflow-hidden border border-[#D8DFE8] flex items-center justify-center shadow-sm select-none group"
          >
            {/* The Authentic Photo */}
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="w-full h-full object-contain transition-transform duration-300 ease-out"
              draggable={false}
            />

            {/* Subtle Top-Left Photo Title Overlay */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#202124]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-white text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C49A45]" />
              <span>{activePhoto.title}</span>
            </div>

            {/* Subtle Top-Right Counter Overlay */}
            <div className="absolute top-3 right-3 z-10 bg-[#202124]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-mono font-bold">
              <span className="text-[#C49A45]">{currentIndex + 1}</span> / {filteredPhotos.length}
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#202124]/80 hover:bg-[#202124] text-white border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#202124]/80 hover:bg-[#202124] text-white border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Tap to Fullscreen Button Overlay (Bottom Right) */}
            <button
              onClick={() => setIsFullscreenLightbox(true)}
              className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-[#202124]/85 hover:bg-[#202124] backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#C49A45]" />
              <span>Full Screen</span>
            </button>
          </div>

          {/* ================= THUMBNAILS FILMSTRIP ================= */}
          <div className="h-20 sm:h-22 w-full mt-2.5 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 px-0.5">
            {filteredPhotos.map((photo, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={photo.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-full aspect-[16/10] rounded-lg overflow-hidden relative shrink-0 transition-all border-2 ${
                    isSelected
                      ? 'border-[#C49A45] scale-102 shadow-md'
                      : 'border-white/80 opacity-70 hover:opacity-100 hover:border-[#263746]'
                  }`}
                  title={photo.title}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#C49A45]/15 border-2 border-[#C49A45] rounded-lg pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= GRID VIEW ================= */
        <div className="flex-1 w-full overflow-y-auto no-scrollbar pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 my-1">
          {filteredPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => {
                setCurrentIndex(idx);
                setViewMode('carousel');
              }}
              className="group relative rounded-xl overflow-hidden bg-[#202124] border border-[#D8DFE8] hover:border-[#263746] transition-all aspect-[16/10] shadow-xs active:scale-98 text-left"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <span className="text-white text-xs font-semibold line-clamp-1">
                  {photo.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FULL-SCREEN LIGHTBOX MODAL                            */}
      {/* ======================================================== */}
      {isFullscreenLightbox && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-[#202124] flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C49A45] animate-pulse" />
              <span className="text-sm sm:text-base font-bold tracking-tight">
                {activePhoto.title}
              </span>
              <span className="text-xs font-mono text-[#E9EDF2]/70 ml-2">
                ({currentIndex + 1} of {filteredPhotos.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  isAutoPlaying
                    ? 'bg-[#C49A45] border-[#C49A45] text-white'
                    : 'bg-[#30343B] border-white/10 text-white hover:bg-black/40'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Pause' : 'Auto'}</span>
              </button>

              <button
                onClick={() => setIsFullscreenLightbox(false)}
                className="w-10 h-10 rounded-full bg-[#30343B] hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition-all"
                title="Close Full Screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Lightbox Image Viewport */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-3">
            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300"
              draggable={false}
            />

            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Bar */}
          <div className="flex items-center justify-center text-xs text-[#E9EDF2]/70 font-mono z-20">
            <span>Swipe left / right or use arrow keys • Tap Close or press ESC to exit</span>
          </div>
        </div>
      )}
    </div>
  );
};
