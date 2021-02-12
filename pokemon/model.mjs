const createPokemonObject = (id, name, img) => {
  return {
    id,
    name,
    img,
  };
};

export const getPokemonObjectById = async (id) => {
  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let data = await response.json();
    return createPokemonObject(data.id, data.name, data.sprites.back_default);
  } catch (err) {
    alert(err);
  }
};
