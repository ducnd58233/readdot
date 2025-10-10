import { useState, useCallback } from 'react';
import { Highlight, HighlightColor } from '@/types';

export function useHighlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>('#FFEB3B');

  const addHighlight = useCallback(
    (highlightData: Omit<Highlight, 'id' | 'timestamp'>) => {
      const newHighlight: Highlight = {
        ...highlightData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      
      setHighlights(prev => [...prev, newHighlight]);
    },
    []
  );

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setHighlights(prev => 
      prev.map(h => h.id === id ? { ...h, note: note || undefined } : h)
    );
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlights([]);
  }, []);

  const changeColor = useCallback((color: HighlightColor) => {
    setSelectedColor(color);
  }, []);

  return {
    highlights,
    selectedColor,
    addHighlight,
    removeHighlight,
    updateNote,
    clearHighlights,
    changeColor,
  };
}