import { Highlight, HighlightColor } from "@/types";
import { useCallback, useState } from "react";

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
    clearHighlights,
    changeColor,
  };
}