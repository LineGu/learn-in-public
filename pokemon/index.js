const submitButton = document.querySelector('#submitPokemonId');
const IdInputElem = document.querySelector('#pokemonIdInput');
const imageContainerElem = document.querySelector('.imgContainer');

const createPokemonObject = (id, name, img) => {
  return {
    id,
    name,
    img,
  };
};

const getPokemonObjectById = async (id) => {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let data = await response.json();
    return createPokemonObject(data.id, data.name, data.sprites.back_default);
  } catch (err) {
    alert(err);
  }
};

const getIdToFind = () => {
  const idToFind = IdInputElem.value;
  IdInputElem.value = '';
  return idToFind;
};

const insertPokemonElemToDom = (pokemonElem) => {
  const isEmptyDom = imageContainerElem.childElementCount === 0;
  if (!isEmptyDom) imageContainerElem.firstElementChild.remove();
  imageContainerElem.insertAdjacentHTML('beforeend', pokemonElem);
};

const createPokemonElem = (pokemonObject) =>
  `<div><img src="${pokemonObject.img}" alt ="${pokemonObject.name} 사진"/> <p>이름 : ${pokemonObject.name}</p></div>`;

const findPokemon = async () => {
  const idToFind = getIdToFind();
  const pokemonObject = await getPokemonObjectById(idToFind);
  const pokemonElem = createPokemonElem(pokemonObject);
  insertPokemonElemToDom(pokemonElem);
};

submitButton.addEventListener('click', findPokemon);
