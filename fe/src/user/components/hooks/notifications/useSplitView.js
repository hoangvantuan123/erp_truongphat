import { useState, useCallback, useEffect } from 'react';

export const useSplitView = () => {
  const [splitPosition, setSplitPosition] = useState(40);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    const container = document.querySelector('.split-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    if (newPosition >= 20 && newPosition <= 80) {
      setSplitPosition(newPosition);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    splitPosition,
    isResizing,
    splitRef: { current: null },
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};