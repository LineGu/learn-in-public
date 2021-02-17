export const createCardContainerElem = (containerName, count, card, id) => {
  return `
  <section class="card-container-no-event " draggable="true" id="${containerName}${id}">
    <div class="card-box">
      <div class="container-name-modify hidden">
        <p>Title</p>
        <input placeholder="${containerName}"/>
        <button>Ok</button>
      </div>
      <div class="card-box-header">
        <p>${count}</p>
        <strong class="container-name">${containerName}</strong>
        <div class="plus-img" id="${containerName}${id}-plus">+</div>
        <div class="more-img-container" id="${containerName}${id}-container-edit">...</div>
      </div>
      <div class="edit-modal-box hidden" id="${containerName}${id}-container-edit-modal">
        <div class="top">
          <p>Edit container</p>
        </div>
        <div class="delete-container" id="${id}">
          <p>Delete container</p>
        </div>
      </div>
      <div class="card-box-body">

        <section class="add-card-box hidden">
          <div class="input-card">
            <input class="new-card-header new-card-name" placeholder="Enter a card title" />
            <textarea class="new-card-body new-card-name" placeholder="Enter a card content"></textarea>
          </div>
          <div class="confirm-card">
            <button class="confirm-button-add">Add</button>
            <button class="confirm-button-cancle">Cancle</button>
          </div>
        </section>

      ${card}
      </div>
    </div>
  </section>`;
};

export const createCardElem = (header, body, who) => {
  return `
  <div class="card" draggable="true">
    <img class="remove-card hidden" src="./assets/remove.png" alt="카드 제거 이미지">
    <section class="card-header">
      <img src="./assets/card.png" alt="카드 사진" draggable="false" />
      <strong>${header}</strong>
      <div class="more-img-card">...</div>
    </section>
    <div>${body}</div>
    <section class="card-footer">
      <div class="card-footer-text">
        <p class="add">added by</p>
        <p>${who}</p>
      </div>
    </section>
  </div>`;
};

export const createAddingCardContainerElem = () => {
  return `<section class="add-card-container">
  <strong>+ Add column</strong>
</section> <div class="helper hidden">------</div>`;
};
