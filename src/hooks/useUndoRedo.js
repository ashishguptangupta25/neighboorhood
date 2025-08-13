import { useState } from 'react';

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = (newState) => {
    const updatedHistory = history.slice(0, currentIndex + 1);
    updatedHistory.push(newState);
    setHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const redo = () => {
    if (currentIndex < history.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const currentState = history[currentIndex];

  return [currentState, setState, undo, redo];
}

export default useUndoRedo;