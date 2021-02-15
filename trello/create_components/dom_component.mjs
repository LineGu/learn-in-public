export const createCardContainerElem = (containerName, count, card) => {
  return `<section class="card-container" draggable="true" id="${containerName}">
          <div class="card-box">
            <div class="card-box-header">
              <p>${count}</p>
              <strong>${containerName}</strong>
              <div class="plus-img">+</div>
              <div class="more-img">...</div>
            </div>
            <div class="card-box-body">
            ${card}
            </div>
          </div>
        </section>`;
};

export const createCardElem = (header, body, who) => {
  return `<div class="card" draggable="true">
    <section class="card-header">
      <img src="./assets/card.png" alt="카드 사진" draggable="false" />
      <strong>${header}</strong>
      <div class="more-img">...</div>
    </section>
    <div>
      ${body}
    </div>
    <section class="card-footer">
      <p class="add">added by</p>
      <p>${who}</p>
    </section>
  </div>`;
};

export const createAddingCardContainerElem = () => {
  return `<section class="add-card-container">
  <strong>+ Add column</strong>
</section> <div class="helper">------</div>`;
};
