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
