import { useState, useEffect } from 'react';

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

function PokemonCard({ name, url, handleOnClick }) {
  return (
      <button className="poke-card" onClick={handleOnClick}>
      <img alt={name} src={url} />
      <div className="poke-name">{name}</div>
    </button>
  );
}
  
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

export { PokemonCard, Game };
export { gameStateEnum, pokemonNames };