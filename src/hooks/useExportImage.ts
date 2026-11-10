import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { EraId, KanyeFortunePackage } from '../types/fortune';
import { copyFortuneToClipboard, createTwitterShareUrl } from '../utils/shareHelpers';

export type ExportFormat = 'square' | 'story'; // 'square' = 1:1 (1080x1080), 'story' = 9:16 (1080x1920)

export interface UseExportImageReturn {
  isExporting: boolean;
  exportImage: (
    elementRef: HTMLElement | null,
    format: ExportFormat,
    era: EraId
  ) => Promise<string | null>;
  copyQuoteToClipboard: (fortune: KanyeFortunePackage) => Promise<boolean>;
  shareToTwitter: (fortune: KanyeFortunePackage) => void;
}

/**
 * Custom hook managing high-DPI image rasterization via html-to-image,
 * font rasterization gating, automatic downloads, and viral social sharing.
 */
export function useExportImage(): UseExportImageReturn {
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const exportImage = useCallback(
    async (
      elementRef: HTMLElement | null,
      format: ExportFormat,
      era: EraId
    ): Promise<string | null> => {
      // Boundary check: Handle null element reference safely
      if (!elementRef) {
        return null;
      }

      setIsExporting(true);
      try {
        // Await document.fonts.ready prior to rasterization to ensure all web fonts are loaded
        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
          try {
            await document.fonts.ready;
          } catch (fontErr) {
            console.warn('Font loading readiness warning:', fontErr);
          }
        }

        const dimensions =
          format === 'story'
            ? { width: 1080, height: 1920 }
            : { width: 1080, height: 1080 };

        const dataUrl = await toPng(elementRef, {
          quality: 0.98,
          pixelRatio: 2,
          cacheBust: true,
          canvasWidth: dimensions.width,
          canvasHeight: dimensions.height,
          filter: (domNode: HTMLElement) => {
            if (domNode && domNode.classList && typeof domNode.classList.contains === 'function') {
              return !domNode.classList.contains('export-exclude');
            }
            return true;
          },
        });

        // Trigger automatic image download in browser environments
        if (typeof document !== 'undefined' && dataUrl) {
          const timestamp = Date.now();
          const filename = `ye-fortune-oracle-${era}-${timestamp}.png`;
          const downloadAnchor = document.createElement('a');
          downloadAnchor.download = filename;
          downloadAnchor.href = dataUrl;
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          document.body.removeChild(downloadAnchor);
        }

        return dataUrl;
      } catch (err) {
        console.error('Failed to export high-res PNG image:', err);
        return null;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const copyQuoteToClipboard = useCallback(
    async (fortune: KanyeFortunePackage): Promise<boolean> => {
      return await copyFortuneToClipboard(fortune);
    },
    []
  );

  const shareToTwitter = useCallback((fortune: KanyeFortunePackage) => {
    const url = createTwitterShareUrl(fortune);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=550,height=420,noopener,noreferrer');
    }
  }, []);

  return {
    isExporting,
    exportImage,
    copyQuoteToClipboard,
    shareToTwitter,
  };
}

export default useExportImage;
