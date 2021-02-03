const inputValue = document.getElementById('numberToChange')
const addNumber = document.getElementById('add')
const subNumber = document.getElementById('sub')
const imageContainer = document.getElementById('imageContainer')

const rightButton = document.querySelector('#rightButton')
const leftButton = document.querySelector('#leftButton')
const tapButton = document.querySelector('.tapButton')
let tapButtonList = tapButton.querySelectorAll('input')

addNumber.addEventListener('click', function (plusImgTapButton) {
  let numberToAdd = inputValue.value
  let currentAllImg = imageContainer.childElementCount
  let currentFirstImg = imageContainer.firstElementChild.getAttribute('class')
  inputValue.value = ''

  for (let i = 0; i < numberToAdd; i++) {
    let lastImg = imageContainer.querySelectorAll('div')[currentAllImg - currentFirstImg + i]
    /* 만약 현재 내가 보고있는 위치가 애매한 3번이나 이런곳일 때, 넣어지는 순서가 꼬이지 않도록 넣어줌
     */ lastImg.insertAdjacentHTML(
      'afterend',
      `<div class="` +
        `${i + 1 + currentAllImg}` +
        `"><img class="plus" src="./assets/basis.png" alt="사진을 불러올 수 없습니다." /><strong>` +
        `${i + 1 + currentAllImg}` +
        `</strong></div>`,
    )

    tapButton.insertAdjacentHTML(
      'beforeend',
      `<input type="radio" name="page" value="` + `${i + 1 + currentAllImg}` + `" />`,
    )
  }
  let tapButtonList = tapButton.querySelectorAll('input')
})

rightButton.addEventListener('click', function (rightMove) {
  let first = imageContainer.firstElementChild
  imageContainer.append(first) /* 왜 돼? 제일 앞 요소를 반화하면서 지우거나/ 뭐지?*/
  let tapButtonList = tapButton.querySelectorAll('input')
  for (let i = 0; i < 100; i++) {
    if (imageContainer.firstElementChild.getAttribute('class') === tapButtonList[i].value) {
      tapButtonList[i].checked = true
      break
    }
  }
})

leftButton.addEventListener('click', function (leftMove) {
  let last = imageContainer.lastElementChild
  imageContainer.prepend(last) /* 왜 돼? 제일 앞 요소를 반화하면서 지우거나/ 뭐지?*/
  let tapButtonList = tapButton.querySelectorAll('input')
  for (let i = 0; i < 100; i++) {
    if (imageContainer.firstElementChild.getAttribute('class') === tapButtonList[i].value) {
      tapButtonList[i].checked = true
      break
    }
  }
})

tapButton.addEventListener('click', function (tapClick) {
  let targetTap = tapClick.target.value
  for (let i = 0; i < imageContainer.childElementCount; i++) {
    if (imageContainer.firstElementChild.getAttribute('class') === targetTap) {
      break
    }
    let first = imageContainer.firstElementChild
    imageContainer.append(first)
  }
})

for (let i = 0; i < 100; i++) {
  if (imageContainer.firstElementChild.getAttribute('class') === tapButtonList[i].value) {
    tapButtonList[i].checked = true
    break
  }
}
