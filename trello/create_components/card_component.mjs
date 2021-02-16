export const createCardContainerObject = (name, id) => {
  return {
    id,
    name,
    count: 0,
    cards: [],
  };
};

export const createCardObject = (header, body, footer, id) => {
  return {
    id,
    header,
    body,
    footer,
  };
};
