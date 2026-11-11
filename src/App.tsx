import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EraId, ViewMode } from './types/fortune';
import { getEraConfig } from './data/eras';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ModeToggle } from './components/fortune/ModeToggle';
import { OracleCard } from './components/fortune/OracleCard';
import { ThermalReceipt } from './components/fortune/ThermalReceipt';
import { ActionToolbar } from './components/fortune/ActionToolbar';
import { Toast } from './components/ui/Toast';
import { useKanyeFortune } from './hooks/useKanyeFortune';
import { useYeAudio } from './hooks/useYeAudio';

// Lazy-load the heavy export modal + html-to-image canvas rasterizer on demand
const ExportModal = lazy(() => import('./components/export/ExportModal'));

export function App() {
  const {
    fortune,
    isLoading,
    isFlipped,
    activeEra,
    viewMode,
    setActiveEra,
    setViewMode,
    drawFortune,
    flipCard,
  } = useKanyeFortune({ autoDraw: true });

  const {
    isMuted,
    toggleMute,
    playSubBass808,
    playCardFlipWhoosh,
    playReceiptClick,
    initAudio,
  } = useYeAudio();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const currentEra = getEraConfig(activeEra);

  // Dynamic canvas confetti celebration trigger for God Level / Ascendant fortunes
  const triggerConfetti = useCallback(async (era: EraId) => {
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
        const colors =
          era === 'graduation'
            ? ['#ec4899', '#fbbf24', '#a855f7', '#38bdf8', '#ffffff']
            : era === '808s'
            ? ['#06b6d4', '#f43f5e', '#38bdf8', '#ffffff']
            : era === 'yeezus'
            ? ['#ef4444', '#cbd5e1', '#ffffff', '#27272a']
            : ['#ffffff', '#a1a1aa', '#71717a', '#3f3f46'];

        const { default: confetti } = await import('canvas-confetti');
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors,
        });
      }
    } catch (err) {
      console.debug('Confetti execution skipped:', err);
    }
  }, []);

  // Sync data-era attribute to document element for root CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-era', activeEra);
  }, [activeEra]);

  // Audio-aware era selector
  const handleSelectEra = useCallback(
    (era: EraId) => {
      setActiveEra(era);
      playSubBass808();
    },
    [setActiveEra, playSubBass808]
  );

  // Audio-aware view mode toggler
  const handleToggleViewMode = useCallback(
    (mode: ViewMode) => {
      if (mode === viewMode) return;
      if (mode === 'receipt') {
        playReceiptClick();
      } else {
        playCardFlipWhoosh();
      }
      setViewMode(mode);
    },
    [viewMode, playReceiptClick, playCardFlipWhoosh, setViewMode]
  );

  // Audio-aware card flip handler
  const handleFlip = useCallback(() => {
    playCardFlipWhoosh();
    flipCard();
  }, [playCardFlipWhoosh, flipCard]);

  // Audio-aware fortune draw handler
  const handleDraw = useCallback(async () => {
    initAudio();
    playSubBass808();
    const drawn = await drawFortune();
    if (viewMode === 'receipt') {
      playReceiptClick();
    }
    if (drawn) {
      const verdictUpper = drawn.destinyVerdict.title.toUpperCase();
      if (
        verdictUpper.includes('GOD LEVEL') ||
        verdictUpper.includes('ASCENDANT') ||
        drawn.auraScore >= 98
      ) {
        triggerConfetti(activeEra);
      }
    }
    return drawn;
  }, [
    initAudio,
    playSubBass808,
    drawFortune,
    viewMode,
    playReceiptClick,
    activeEra,
    triggerConfetti,
  ]);

  // Mute toggler with toast feedback
  const handleToggleMute = useCallback(() => {
    const updatedMuted = toggleMute();
    setToastMessage(updatedMuted ? 'Sound muted' : 'Sound enabled');
  }, [toggleMute]);

  // Keyboard shortcut listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Avoid triggering when user is actively typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleDraw();
      } else if (e.key === '1') {
        handleSelectEra('donda');
      } else if (e.key === '2') {
        handleSelectEra('graduation');
      } else if (e.key === '3') {
        handleSelectEra('808s');
      } else if (e.key === '4') {
        handleSelectEra('yeezus');
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key.toLowerCase() === 'f') {
        handleFlip();
      }
    },
    [handleDraw, handleSelectEra, handleToggleMute, handleFlip]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      data-era={activeEra}
      className="min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden"
      style={{
        backgroundColor: currentEra.colors.bg,
      }}
    >
      {/* Era Atmosphere Glow / Radial Gradient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40 transition-opacity duration-700 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${currentEra.colors.surface} 0%, transparent 70%)`,
        }}
      />

      {/* App Header */}
      <Header
        activeEra={activeEra}
        onSelectEra={handleSelectEra}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-start">
        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <motion.div
            key={currentEra.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-1.5"
          >
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
              ORACLE OF YE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mt-0.5">
              {currentEra.description}
            </p>
          </motion.div>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="mb-4">
          <ModeToggle
            viewMode={viewMode}
            onToggleMode={handleToggleViewMode}
            activeEra={activeEra}
          />
        </div>

        {/* Stage Presentation: 3D Tarot Card vs Thermal Receipt */}
        <div className="w-full max-w-md mx-auto relative flex justify-center">
          <AnimatePresence mode="wait">
            {viewMode === 'card' ? (
              <motion.div
                key="stage-card"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center"
              >
                <OracleCard
                  fortune={fortune}
                  activeEra={activeEra}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : (
              <motion.div
                key="stage-receipt"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex justify-center"
              >
                <ThermalReceipt
                  fortune={fortune}
                  activeEra={activeEra}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Toolbar */}
        <ActionToolbar
          fortune={fortune}
          viewMode={viewMode}
          isFlipped={isFlipped}
          isLoading={isLoading}
          activeEra={activeEra}
          onRedraw={handleDraw}
          onFlip={handleFlip}
          onExport={() => setIsExportModalOpen(true)}
          onToast={setToastMessage}
        />
      </main>

      {/* Floating Action Feedback Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* High-DPI Export Modal (Code Split / Lazy Loaded) */}
      {isExportModalOpen && (
        <Suspense fallback={null}>
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            fortune={fortune}
            activeEra={activeEra}
            viewMode={viewMode}
            onToast={setToastMessage}
          />
        </Suspense>
      )}

      {/* App Footer */}
      <Footer activeEra={activeEra} />
    </div>
  );
}

export default App;
