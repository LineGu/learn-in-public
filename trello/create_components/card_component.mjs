export const createCardContainerObject = (name) => {
  return {
    name,
    count: 0,
    cards: [],
  };
};

export const createCardObject = (header, body, footer) => {
  return {
    header,
    body,
    footer,
  };
};
