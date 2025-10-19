import { useState } from 'react';
import { Accessibility, ZoomIn, ZoomOut, Contrast, Type, MousePointer, Focus, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';

export default function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [largerCursor, setLargerCursor] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [pauseAnimations, setPauseAnimations] = useState(false);
  const { t } = useLanguage();

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleLargerCursor = () => {
    setLargerCursor(!largerCursor);
    if (!largerCursor) {
      document.body.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'%3E%3Cpath d=\'M2 2 L2 28 L12 20 L16 30 L20 28 L16 18 L28 18 Z\' fill=\'%23C4A572\'/%3E%3C/svg%3E") 4 4, auto';
    } else {
      document.body.style.cursor = 'auto';
    }
  };

  const toggleHighlightLinks = () => {
    setHighlightLinks(!highlightLinks);
    if (!highlightLinks) {
      document.documentElement.classList.add('highlight-links');
    } else {
      document.documentElement.classList.remove('highlight-links');
    }
  };

  const togglePauseAnimations = () => {
    setPauseAnimations(!pauseAnimations);
    if (!pauseAnimations) {
      document.documentElement.classList.add('pause-animations');
    } else {
      document.documentElement.classList.remove('pause-animations');
    }
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setLargerCursor(false);
    setHighlightLinks(false);
    setPauseAnimations(false);
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove('high-contrast', 'highlight-links', 'pause-animations');
    document.body.style.cursor = 'auto';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-24 left-6 z-50 h-12 w-12 rounded-full bg-[#C4A572] hover:bg-[#D4B582] text-black shadow-lg"
        >
          <Accessibility className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black border-r-2 border-[#C4A572] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white text-xl">{t('accessibility')}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Text Size */}
          <div className="space-y-2">
            <p className="text-[#C4A572] font-semibold flex items-center gap-2">
              <Type className="h-4 w-4" />
              {t('textSize')}
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={decreaseFontSize}
                variant="outline"
                size="icon"
                className="border-[#C4A572] bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <span className="text-white min-w-[60px] text-center">{fontSize}%</span>
              <Button
                onClick={increaseFontSize}
                variant="outline"
                size="icon"
                className="border-[#C4A572] bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator className="bg-[#C4A572]" />

          {/* High Contrast */}
          <Button
            onClick={toggleHighContrast}
            className={`w-full justify-start gap-3 ${
              highContrast
                ? 'bg-[#C4A572] text-black hover:bg-[#D4B582]'
                : 'bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black border border-[#C4A572]'
            }`}
          >
            <Contrast className="h-5 w-5" />
            {t('highContrast')}
          </Button>

          {/* Larger Cursor */}
          <Button
            onClick={toggleLargerCursor}
            className={`w-full justify-start gap-3 ${
              largerCursor
                ? 'bg-[#C4A572] text-black hover:bg-[#D4B582]'
                : 'bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black border border-[#C4A572]'
            }`}
          >
            <MousePointer className="h-5 w-5" />
            {t('largerCursor')}
          </Button>

          {/* Highlight Links */}
          <Button
            onClick={toggleHighlightLinks}
            className={`w-full justify-start gap-3 ${
              highlightLinks
                ? 'bg-[#C4A572] text-black hover:bg-[#D4B582]'
                : 'bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black border border-[#C4A572]'
            }`}
          >
            <Focus className="h-5 w-5" />
            {t('highlightLinks')}
          </Button>

          {/* Pause Animations */}
          <Button
            onClick={togglePauseAnimations}
            className={`w-full justify-start gap-3 ${
              pauseAnimations
                ? 'bg-[#C4A572] text-black hover:bg-[#D4B582]'
                : 'bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black border border-[#C4A572]'
            }`}
          >
            <Pause className="h-5 w-5" />
            {t('pauseAnimations')}
          </Button>

          <Separator className="bg-[#C4A572]" />

          {/* Reset */}
          <Button
            onClick={resetSettings}
            variant="outline"
            className="w-full border-[#C4A572] bg-zinc-900 text-white hover:bg-[#C4A572] hover:text-black gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t('resetAccessibility')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}