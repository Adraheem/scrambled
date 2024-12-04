import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import {IWord} from "./types";
import {words} from "./assets/data/words";

function App() {
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<IWord | undefined>()
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [currentGuessIds, setCurrentGuessIds] = useState<number[]>([]);
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
      setGameOver(true);
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
        setCurrentGuessIds([]);
      } else if (currentGuess.length >= currentWord.word.length) {
        setGameOver(true);
      }
    }
  }, [currentGuess, currentWord, nextGuess]);

  useEffect(() => {
    nextGuess();
  }, [nextGuess]);

  const resetGame = () => {
    nextGuess();
    setGuessedIds([])
    setCurrentGuess([])
    setCurrentGuessIds([])
    setGameOver(false);
    setPoint(0);
  }

  if (gameOver) {
    return <div className="flex flex-col items-center text-center gap-6 py-10">
      <h2 className="text-white bg-red-500 p-8 rounded-3xl border-4 border-black">Game over</h2>
      <p>Your point is</p>
      <h1 className="btn">{point}</h1>

      <div>
        <button onClick={resetGame} className="button">Start again</button>
      </div>
    </div>
  }

  return (
    <div className="flex flex-col items-center text-center gap-6 py-10">
      <h5 className="btn">Point: {point}</h5>
      <div>
        <p>Options</p>

        <div className="btn-group">
          {
            scrambledWord?.map((w, idx) => currentGuessIds.includes(idx) ? null : (
              <button key={idx} className="btn" onClick={() => {
                setCurrentGuess(prev => [...prev, w])
                setCurrentGuessIds(prev => [...prev, idx])
              }}>{w}</button>
            ))
          }
        </div>
        <p className="mt-2 italic">Hint: {currentWord?.hint}</p>
      </div>

      <div>
        <p>Your guess</p>

        <div className="btn-group">
          {
            currentGuess?.map((w, idx) => (
              <button key={idx} className="btn" onClick={() => {
                setCurrentGuess(prev => prev.filter((_, i) => i !== idx))
                setCurrentGuessIds(prev => prev.filter((_, i) => i !== idx))
              }}>{w}</button>
            ))
          }
        </div>
      </div>

      <div>
        <button onClick={resetGame} className="button">reset game</button>
      </div>
    </div>
  );
}

export default App;
