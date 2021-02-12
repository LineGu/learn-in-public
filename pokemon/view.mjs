const imageContainerElem = document.querySelector('.imgContainer');

export const insertPokemonElemToDom = (pokemonElem) => {
  const isEmptyDom = imageContainerElem.childElementCount === 0;
  if (!isEmptyDom) imageContainerElem.firstElementChild.remove();
  imageContainerElem.insertAdjacentHTML('beforeend', pokemonElem);
};

export const createPokemonElem = (pokemonObject) =>
  `<div><img src="${pokemonObject.img}" alt ="${pokemonObject.name} 사진"/> <p>이름 : ${pokemonObject.name}</p></div>`;
