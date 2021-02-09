const numberToAddElem = document.querySelector('#numberToAdd');
const addButtonElem = document.querySelector('#add');
const imageContainerElem = document.querySelector('#sliderContent');
const tabButtonElem = document.querySelector('.tabButtonBox');
const arrowBoxElem = document.querySelector('.ArrowAndImgBox');

const ArrowButton = {
  left: 'LEFT_BUTTON',
  right: 'RIGHT_BUTTON',
};

const createImgElem = (number) =>
  `<div class="${number}"><img class="plus" src="./assets/basis.png" alt="사진을 불러올 수 없습니다." /><strong>${number}</strong></div>`;

const createTabElem = (number) => `<input type="radio" name="page" value="${number}" />`;

const resetInputValue = (elem) => (elem.value = '');

const checkTabButton = (imgNumberToCheck) => {
  const tabButtonElemList = tabButtonElem.querySelectorAll('input');
  const indexToCheck = imgNumberToCheck - 1;
  tabButtonElemList[indexToCheck].checked = true;
};

const initializeCheckTabButton = () => {
  checkTabButton(1);
};

const addImgItem = (totalImgCount, remainingCountToAdd) => {
  const firstIndexImg = imageContainerElem.firstElementChild.classList[0];
  const currentlastImgIndex = totalImgCount - firstIndexImg;
  const lastImg = imageContainerElem.querySelectorAll('div')[currentlastImgIndex];

  while (remainingCountToAdd) {
    const PageNumberToAdd = totalImgCount + remainingCountToAdd;

    lastImg.insertAdjacentHTML('afterend', createImgElem(PageNumberToAdd));

    remainingCountToAdd -= 1;
  }
};

const addTabItem = (totalImgCount, remainingCountToAdd) => {
  const lastTabButton = tabButtonElem.lastElementChild;

  while (remainingCountToAdd) {
    const PageNumberToAdd = totalImgCount + remainingCountToAdd;

    lastTabButton.insertAdjacentHTML('afterend', createTabElem(PageNumberToAdd));

    remainingCountToAdd -= 1;
  }
};

const addImgTabElem = () => {
  const numberToAdd = numberToAddElem.value;
  const totalImgCount = imageContainerElem.childElementCount;
  let remainingCountToAdd = Number(numberToAdd);

  resetInputValue(numberToAddElem);

  addImgItem(totalImgCount, remainingCountToAdd);
  addTabItem(totalImgCount, remainingCountToAdd);
};

const slideRightImg = (numberToSlide) => {
  while (numberToSlide) {
    const firstImgElem = imageContainerElem.firstElementChild;
    imageContainerElem.append(firstImgElem);
    numberToSlide -= 1;
  }
};

const slideLeftImg = (numberToSlide) => {
  while (numberToSlide) {
    const lastImgElem = imageContainerElem.lastElementChild;
    imageContainerElem.prepend(lastImgElem);
    numberToSlide -= 1;
  }
};

const moveByArrow = (event) => {
  const { id: directionToMove } = event.target;

  switch (directionToMove) {
    case ArrowButton.right:
      slideRightImg(1);
      break;

    case ArrowButton.left:
      slideLeftImg(1);
      break;
  }

  const firstImgNumber = imageContainerElem.firstElementChild.classList[0];
  checkTabButton(firstImgNumber);
};

const moveByTab = (event) => {
  const { value: clickedTabButtonNumber } = event.target;
  const firstIndexImg = imageContainerElem.firstElementChild.classList[0];
  const isSlideToRight = firstIndexImg < clickedTabButtonNumber;
  const numberToSlide = isSlideToRight
    ? clickedTabButtonNumber - firstIndexImg
    : firstIndexImg - clickedTabButtonNumber;

  checkTabButton(clickedTabButtonNumber);
  if (isSlideToRight) {
    slideRightImg(numberToSlide);
    return;
  }

  slideLeftImg(numberToSlide);
};

initializeCheckTabButton();
addButtonElem.addEventListener('click', addImgTabElem);
arrowBoxElem.addEventListener('click', moveByArrow);
tabButtonElem.addEventListener('click', moveByTab);
