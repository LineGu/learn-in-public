export const createCardContainerElem = (container, card) => {
  return `
  <section class="card-container" draggable="false" id="${container.name}-${container.id}">
    <div class="container-helper" id = "container-helper-box-${container.id}">
      <div class="container-helper-left" id ="container-helper-left-${container.id}"></div>
      <div class="container-helper-right" id="container-helper-right-${container.id}"></div>
    </div>
    <div class="card-box">
      <div class="container-name-modify hidden" id="${container.id}-edit-mode-top">
        <p>Title</p>
        <input id="edited-name-${container.id}" placeholder="${container.name}" value="${container.name}"/>
        <button class="confirm-container-edit" id="confirm-edited-name-${container.id}">Ok</button>
      </div>
      <div class="card-box-header" id="${container.id}-edit-mode-header">
        <p class="container-count">${container.count}</p>
        <strong class="container-name">${container.name}</strong>
        <div class="plus-img" id="${container.name}${container.id}-card-adding">+</div>
        <div class="more-img-container" id="${container.name}${container.id}-container-edit">...</div>
      </div>
      <div class="edit-modal-box hidden" id="${container.name}${container.id}-container-edit-modal">
        <div class="top edit-mode-container" id="${container.id}-edit">
          <p>Edit container</p>
        </div>
        <div class="delete-container" id="${container.id}">
          <p>Delete container</p>
        </div>
      </div>
      <div class="card-box-body" id="card-box-body-${container.id}">

        <section class="add-card-box hidden" id="${container.name}${container.id}-card-adding-modal">
          <div class="input-card">
            <input class="new-card-header new-card-name new-card-header-${container.id}" placeholder="Enter a card title" />
            <textarea class="new-card-body new-card-name new-card-body-${container.id}" placeholder="Enter a card content"></textarea>
          </div>
          <div class="confirm-card">
            <button class="confirm-button-add" id="add-card-${container.id}">Add</button>
            <button class="confirm-button-cancle" id="close-${container.name}${container.id}-card-adding-modal">Cancle</button>
          </div>
        </section>

      ${card}
      </div>
    </div>
  </section>`;
};

export const createCardElem = (card, container) => {
  return `
  <div class="card-total-box "  id = "card-total-box-${container.id}-${card.id}">
    <div class="card-helper" id = "card-helper-box-${container.id}-${card.id}">
      <div class="card-helper-top" id ="card-helper-top-${container.id}-${card.id}"></div>
      <div class="card-helper-bottom" id="card-helper-bottom-${container.id}-${card.id}"></div>
    </div>
    <section class="edit-card-box hidden" id="edit-box-${container.id}-${card.id}">
       <div class="input-edit-card">
        <input class="edit-card-header edit-card-name edit-card-header-${container.id}-${card.id}" value="${card.header}" />
        <textarea class="edit-card-body edit-card-name edit-card-body-${container.id}-${card.id}" >${card.body}</textarea>
       </div>
      <div class="confirm-card">
        <button class="confirm-button-add-edit" id="confirm-edit-${container.id}-${card.id}">Ok</button>
        <button class="confirm-button-cancle-edit" id="cancle-${container.id}-${card.id}">Cancle</button>
      </div>
    </section>
    <div class="card" draggable="false" id="card-${container.id}-${card.id}">
      <section class="card-header">
        <img src="./assets/card.png" alt="카드 사진" draggable="false" />
        <strong id="card-header-${card.id}">${card.header}</strong>
        <div class="more-img-card" id="more-${container.id}-${card.id}">...</div>
      </section>

      <section class="remove-box hidden" id="edit-mode-bottom-box-${container.id}-${card.id}">
        <img class="remove-card remove-${container.id}-${card.id}" id="edit-mode-bottom-${container.id}-${card.id}" src="./assets/trash.png" alt="카드 제거 이미지">
      </section>

      <section class="edit-modal-box-card hidden" id="edit-modal-${container.id}-${card.id}">
          <div class="top edit-mode-card" id="edit-${container.id}-${card.id}">
            <p>Edit card</p>
          </div>
          <div class="delete-card" id="delete-${container.id}-${card.id}">
            <p>Delete card</p>
          </div>
      </section>

      <div id="card-body-${card.id}">${card.body}</div>
      <section class="card-footer">
        <div class="card-footer-text">
          <p class="add">added by</p>
          <p id="card-footer-${card.id}">${card.footer}</p>
        </div>
      </section>
    </div>
  </div>`;
};

export const createAddingCardContainerElem = () => {
  return `<section class="add-card-container">
  <strong>+ Add column</strong>
</section> <div class="helper hidden">------</div>`;
};
