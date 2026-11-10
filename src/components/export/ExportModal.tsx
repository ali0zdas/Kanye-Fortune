import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EraId, KanyeFortunePackage, ViewMode } from '../../types/fortune';
import { getEraConfig } from '../../data/eras';
import { DedicatedExportCard } from './DedicatedExportCard';
import { useExportImage, ExportFormat } from '../../hooks/useExportImage';
import {
  X,
  Download,
  Copy,
  Check,
  Share2,
  Loader2,
  Sparkles,
  Smartphone,
  Square,
} from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fortune: KanyeFortunePackage | null;
  activeEra: EraId;
  viewMode: ViewMode;
  onToast?: (message: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  fortune,
  activeEra,
  viewMode,
  onToast,
}) => {
  const [format, setFormat] = useState<ExportFormat>('square');
  const [copied, setCopied] = useState<boolean>(false);
  const exportTargetRef = useRef<HTMLDivElement>(null);

  const eraConfig = getEraConfig(activeEra);
  const { isExporting, exportImage, copyQuoteToClipboard, shareToTwitter } =
    useExportImage();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!exportTargetRef.current) return;
    const result = await exportImage(exportTargetRef.current, format, activeEra);
    if (result && onToast) {
      onToast(`High-res PNG downloaded (${format === 'story' ? '9:16 Story' : '1:1 Square'})!`);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!fortune) return;
    const success = await copyQuoteToClipboard(fortune);
    if (success) {
      setCopied(true);
      if (onToast) onToast('Ye wisdom copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fortune, copyQuoteToClipboard, onToast]);

  const handleShareTwitter = useCallback(() => {
    if (!fortune) return;
    shareToTwitter(fortune);
    if (onToast) onToast('Opening Twitter / X share intent...');
  }, [fortune, shareToTwitter, onToast]);

  return (
    <>
      {/* ========================================================= */}
      {/* OFF-SCREEN HIGH-DPI SNAPSHOT TARGET (1080x1080 or 1080x1920)*/}
      {/* ========================================================= */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: '1080px',
          height: format === 'story' ? '1920px' : '1080px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
        }}
        aria-hidden="true"
      >
        <DedicatedExportCard
          ref={exportTargetRef}
          fortune={fortune}
          activeEra={activeEra}
          viewMode={viewMode}
          format={format}
        />
      </div>

      {/* ========================================================= */}
      {/* VISUAL PREVIEW MODAL DIALOG                               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
              style={{
                backgroundColor: `${eraConfig.colors.surface}fa`,
                borderColor: eraConfig.colors.border,
                boxShadow: `0 25px 70px -15px ${eraConfig.colors.glow}`,
              }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b"
                style={{ borderColor: `${eraConfig.colors.border}40` }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: eraConfig.colors.accent }}
                  />
                  <h3 className="text-sm font-mono font-bold tracking-widest uppercase text-white">
                    EXPORT YE ORACLE
                  </h3>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close export modal"
                  className="export-exclude p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Format Selector Tabs */}
              <div className="px-5 pt-3 pb-1 flex justify-center">
                <div className="export-exclude inline-flex p-1 rounded-xl bg-black/50 border border-white/10 gap-1">
                  <button
                    onClick={() => setFormat('square')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                      format === 'square'
                        ? 'bg-white/20 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    style={
                      format === 'square'
                        ? {
                            backgroundColor: `${eraConfig.colors.accent}30`,
                            color: eraConfig.colors.accent,
                          }
                        : {}
                    }
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>1:1 Square</span>
                  </button>

                  <button
                    onClick={() => setFormat('story')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                      format === 'story'
                        ? 'bg-white/20 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    style={
                      format === 'story'
                        ? {
                            backgroundColor: `${eraConfig.colors.accent}30`,
                            color: eraConfig.colors.accent,
                          }
                        : {}
                    }
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>9:16 Story</span>
                  </button>
                </div>
              </div>

              {/* Scaled Preview Area */}
              <div className="p-4 flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
                <div
                  className="rounded-2xl overflow-hidden border shadow-inner flex items-center justify-center transition-all duration-300"
                  style={{
                    width: format === 'story' ? '240px' : '330px',
                    height: format === 'story' ? '426px' : '330px',
                    borderColor: `${eraConfig.colors.border}60`,
                    backgroundColor: eraConfig.colors.bg,
                  }}
                >
                  <div
                    style={{
                      width: '1080px',
                      height: format === 'story' ? '1920px' : '1080px',
                      transform:
                        format === 'story'
                          ? 'scale(0.2222)'
                          : 'scale(0.3055)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <DedicatedExportCard
                      fortune={fortune}
                      activeEra={activeEra}
                      viewMode={viewMode}
                      format={format}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div
                className="export-exclude px-5 py-4 border-t flex flex-col sm:flex-row items-center gap-2.5"
                style={{ borderColor: `${eraConfig.colors.border}40` }}
              >
                {/* Primary Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 text-black shadow-lg"
                  style={{
                    backgroundColor: eraConfig.colors.accent,
                    boxShadow: `0 0 20px ${eraConfig.colors.glow}`,
                  }}
                  title="Download High-Res PNG"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <Download className="w-4 h-4 text-black" />
                  )}
                  <span>{isExporting ? 'EXPORTING...' : 'DOWNLOAD PNG'}</span>
                </button>

                {/* Secondary Quick Share Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    disabled={!fortune || isExporting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                    title="Copy formatted quote & prophecy"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? 'COPIED!' : 'COPY'}</span>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    disabled={!fortune || isExporting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all active:scale-95 disabled:opacity-50"
                    title="Share revelation on X (Twitter)"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>POST X</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExportModal;
