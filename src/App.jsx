import { useState, useEffect } from 'react';
import './App.css';

function PokemonCard({ name, url, handleOnClick }) {
  return (
    <button className="poke-card" onClick={handleOnClick}>
      <img alt={name} src={url} />
      <div className="poke-name">{name}</div>
    </button>
  );
}

const gameStateEnum = {
  BeatHighScore: 1,
  LostTheGame: 2,
  BeatTheGame: 3,
  IsPlaying: 4
};

const pokemonNames = [
  "hydreigon", "tyranitar", "garchomp", 
  "roserade", "marshadow", "mewtwo",

  "gengar", "volcarona", "ampharos",
  "rayquaza", "metagross", "salamence"
];

function Game({ handleCardClick }) {
  const [pokemonData, setPokemonData] = useState([]);
  
  const permuteCards = (cards) => {
    const shuffled = [...cards];
    for (let idx = 0; idx < shuffled.length; ++idx) {
      const target = Math.floor(Math.random() * shuffled.length);
      const temp = shuffled[idx];
      shuffled[idx] = shuffled[target];
      shuffled[target] = temp;
    }

    setPokemonData(shuffled);
  }

  useEffect(() => {
    const fetchImgs = async () => {
      try {
        const responses = await Promise.all(pokemonNames.map(name => fetch("https://pokeapi.co/api/v2/pokemon/" + name)));
        const urls = await Promise.all(responses.map(response => response.json()));
        const pokemonData = urls.map((url, idx) => {
            return {
              name: pokemonNames[idx],
              url: url.sprites.front_default,
              hasAlreadyClicked: false
            };
          }
        );

        permuteCards(pokemonData);
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    fetchImgs();
  }, []);

  const cardClick = (card) => {
    handleCardClick(card.hasAlreadyClicked);
    card.hasAlreadyClicked = true;
    permuteCards(pokemonData);
  }

  return (
    <div className="poke-card-container">
      {
        pokemonData.map((card) => {
          return (
            <PokemonCard 
              key={card.name}
              name={card.name}
              url={card.url}
              handleOnClick={() => cardClick(card)}
            />
          );
        })
      }
    </div>
  )
}

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