import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import {IWord} from "./types";
import {words} from "./assets/data/words";

function App() {
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<IWord | undefined>()
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [point, setPoint] = useState(0);

  const scrambledWord: string[] | undefined = useMemo(() => {
    if (!currentWord) return undefined;

    const characters = currentWord.word.split("");

    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]]; // Swap
    }
    return [...characters];
  }, [currentWord]);

  const nextGuess = useCallback(() => {
    const filteredArray = words.filter((_, index) => !guessedIds.includes(index));
    if (filteredArray.length === 0) {
      setGameCompleted(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * filteredArray.length);
    setCurrentWord(filteredArray[randomIndex]);
  }, [guessedIds])

  useEffect(() => {
    if (!!currentWord) {
      if (currentGuess.join("") === currentWord.word) {
        setPoint(prev => prev + 1);
        nextGuess();
        setGuessedIds([]);
        setCurrentGuess([]);
      }
    }
  }, [currentGuess, currentWord, nextGuess]);

  const resetGame = () => {
    setCurrentWord(undefined);
    setGuessedIds([])
    setCurrentGuess([])
    setGameCompleted(false);
    setPoint(0);
  }


  return (
    <div className="App">
      <div>Point: {point}</div>
      <div>
        <p>Options</p>

        <div>
          {
            scrambledWord?.map((w, idx) => (
              <button key={idx} onClick={() => {
                setCurrentGuess(prev => [...prev, w])
              }}>{w}</button>
            ))
          }
        </div>
      </div>

      <div>
        <p>Your guess</p>

        <div>
          {
            currentGuess?.map((w, idx) => (
              <button key={idx} onClick={() => {
                setCurrentGuess(prev => prev.filter((_, i) => i !== idx))
              }}>{w}</button>
            ))
          }
        </div>
      </div>

      <div>
        <button onClick={resetGame}>reset game</button>
      </div>
    </div>
  );
}

export default App;
