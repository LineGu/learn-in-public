<<<<<<< HEAD
const numberToAddElem = document.querySelector('#numberToAdd');
const addButtonElem = document.querySelector('#add');
const imageContainerElem = document.querySelector('#sliderContent');
const tabButtonElem = document.querySelector('.tabButtonBox');
const arrowBoxElem = document.querySelector('.ArrowAndImgBox');

const ArrowButton = {
  left: 'leftButton',
  right: 'rightButton',
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

const initialCheckTabButton = () => {
  checkTabButton(1);
};

const plusImgItem = () => {
  const numberToAdd = numberToAddElem.value;
  const totalImgCount = imageContainerElem.childElementCount;
  const firstIndexImg = imageContainerElem.firstElementChild.classList[0];
  const lastImgIndex = totalImgCount - firstIndexImg;
  const lastImg = imageContainerElem.querySelectorAll('div')[lastImgIndex];
  const lastTabButton = tabButtonElem.lastElementChild;
  let remainingCountToAdd = Number(numberToAdd);

  resetInputValue(numberToAddElem);

  while (remainingCountToAdd) {
    const PageNumberToAdd = totalImgCount + remainingCountToAdd;

    lastImg.insertAdjacentHTML('afterend', createImgElem(PageNumberToAdd));
    lastTabButton.insertAdjacentHTML('afterend', createTabElem(PageNumberToAdd));

    remainingCountToAdd -= 1;
  }
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
  const directionToMove = event.target.id;

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
  const clickedTabButtonNumber = Number(event.target.value);
  const firstIndexImg = Number(imageContainerElem.firstElementChild.classList[0]);
  const isSlideToRight = firstIndexImg < clickedTabButtonNumber;

  checkTabButton(clickedTabButtonNumber);

  if (isSlideToRight) {
    const numberToSlide = clickedTabButtonNumber - firstIndexImg;
    console.log(numberToSlide);
    slideRightImg(numberToSlide);
  } else if (!isSlideToRight) {
    const numberToSlide = firstIndexImg - clickedTabButtonNumber;
    console.log(numberToSlide);
    slideLeftImg(numberToSlide);
  }
};

initialCheckTabButton();
addButtonElem.addEventListener('click', plusImgItem);
arrowBoxElem.addEventListener('click', moveByArrow);
tabButtonElem.addEventListener('click', moveByTab);
=======
const inputValue = document.querySelector('#numberToAdd')
const addNumber = document.querySelector('#add')
const imageContainer = document.querySelector('#sliderContent')
const tapButton = document.querySelector('.tapButtonBox')
const ArrowBox = document.querySelector('.ArrowAndImgBox')

const makeImgToAdd = (number) => {
  return (
    `<div class="` +
    `${number}` +
    `"><img class="plus" src="./assets/basis.png" alt="사진을 불러올 수 없습니다." /><strong>` +
    `${number}` +
    `</strong></div>`
  )
}
const makeTabToAdd = (number) => {
  return `<input type="radio" name="page" value="` + `${number}` + `" />`
}

const tabbuttonCheck = (index) => {
  const tapButtonList = tapButton.querySelectorAll('input')
  tapButtonList[index].checked = true
}

const plusImgItem = () => {
  const numberToAdd = inputValue.value
  const currentAllImg = imageContainer.childElementCount
  const currentFirstImg = imageContainer.firstElementChild.getAttribute('class')
  inputValue.value = ''

  for (let i = 0; i < numberToAdd; i++) {
    const lastImg = imageContainer.querySelectorAll('div')[currentAllImg - currentFirstImg + i]
    lastImg.insertAdjacentHTML('afterend', makeImgToAdd(i + currentAllImg + 1))
    tapButton.insertAdjacentHTML('beforeend', makeTabToAdd(i + currentAllImg + 1))
  }
}

const moveByArrow = (event) => {
  const first = imageContainer.firstElementChild
  const last = imageContainer.lastElementChild
  const direction = event.target.id

  switch (direction) {
    case 'rightButton':
      imageContainer.append(first)
      break

    case 'leftButton':
      imageContainer.prepend(last)
      break
  }
  tabbuttonCheck(imageContainer.firstElementChild.getAttribute('class') - 1)
}

const moveByTab = (event) => {
  const targetTap = event.target.value
  for (let i = 0; i < imageContainer.childElementCount; i++) {
    if (imageContainer.firstElementChild.getAttribute('class') === targetTap) {
      break
    }
    let first = imageContainer.firstElementChild
    imageContainer.append(first)
  }
}

tapButton.firstElementChild.checked = true
addNumber.addEventListener('click', plusImgItem)
ArrowBox.addEventListener('click', moveByArrow)
tapButton.addEventListener('click', moveByTab)
>>>>>>> d48e41b ([Repactory] Repactory html class name and index.js)
