import { getPokemonObjectById } from './model.mjs';
import { insertPokemonElemToDom, createPokemonElem } from './view.mjs';

const submitButton = document.querySelector('#submitPokemonId');
const idInputElem = document.querySelector('#pokemonIdInput');

const getIdToFind = () => {
  const idToFind = idInputElem.value;
  idInputElem.value = '';
  return idToFind;
};

const findPokemon = async () => {
  const idToFind = getIdToFind();
  const pokemonObject = await getPokemonObjectById(idToFind);
  const pokemonElem = createPokemonElem(pokemonObject);
  insertPokemonElemToDom(pokemonElem);
};

submitButton.addEventListener('click', findPokemon);
