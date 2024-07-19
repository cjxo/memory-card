import { useState } from 'react';
import './App.css';

import { Game, gameStateEnum, pokemonNames } from "./Game";

function GameSummary({ signalDoneDoingDialog, gameState, gameScore }) {
  let message = "";
  switch (gameState) {
    case gameStateEnum.BeatHighScore: {
      message = "New High Score!";
    } break;

    case gameStateEnum.LostTheGame: {
      message = "You Lost!";
    } break;

    case gameStateEnum.BeatTheGame: {
      message = "You Beat The Game!";
    } break;
  }

  return (
    <dialog open>
      <div>
        <h2 className="dlg-message">{"Game Over! " + message}</h2>
        <div
          style={{ fontSize: "20px", marginTop: "8px" }}
          >Score: {gameScore}</div>
      </div>
      <form method="dialog">
        <button onClick={signalDoneDoingDialog}>Play Again</button>
      </form>
    </dialog>
  )
}

function App() {
  const [gameScore, setGameScore] = useState(0);
  const [gameHiScore, setGameHiScore] = useState(0);

  const [gameState, setGameState] = useState(gameStateEnum.IsPlaying);

  let mainRenderables = null;

  switch (gameState) {
    case gameStateEnum.BeatHighScore:
    case gameStateEnum.LostTheGame:
    case gameStateEnum.BeatTheGame: {
      mainRenderables = (
        <GameSummary
          signalDoneDoingDialog={() => {
            setGameState(gameStateEnum.IsPlaying);
            setGameScore(0);
          }}
          gameState={gameState}
          gameScore={gameScore}
        />
      );
    } break;

    case gameStateEnum.IsPlaying: {
      const handleUserClick = (wasClicked) => {
        const newGameScore = gameScore + 1;

        if (wasClicked) {
          if (gameScore > gameHiScore) {
            setGameHiScore(gameScore);
            setGameState(gameStateEnum.BeatHighScore);
          } else {
            setGameState(gameStateEnum.LostTheGame);
          }

        } else if (newGameScore === pokemonNames.length) {
          setGameHiScore(pokemonNames.length);
          setGameState(gameStateEnum.BeatTheGame);
        } else {
          setGameScore(newGameScore);
        }
      };
      
      mainRenderables = (
        <Game handleCardClick={handleUserClick} />
      );
    } break;
  }

  return (
    <>
      <header>
        <div className="top-bar">
          <h1>Pokemon Memory Card Game</h1>
          <ul className="score-container">
            <li>Score: {gameScore}</li>
            <li>High Score: {gameHiScore}</li>
          </ul>

        </div>
      </header>
      <main>
        {mainRenderables}
      </main>
    </>
  );
}

export default App;