const inputValue = document.getElementById('numberToChange')
const addNumber = document.getElementById('add')
const subNumber = document.getElementById('sub')
const imageContainer = document.getElementById('imageContainer')
const tapButton = document.querySelector('.tapButton')

addNumber.addEventListener('click', function (plusImgTapButton) {
  let numberToAdd = inputValue.value
  let currentAllImg = parseInt(imageContainer.lastElementChild.getAttribute('class'), 10)

  inputValue.value = ''

  for (let i = 0; i < numberToAdd; i++) {
    imageContainer.insertAdjacentHTML(
      'beforeend',
      `<div class="` +
        `${i + 1 + currentAllImg}` +
        `"><img class="plus" src="./assets/basis.png" alt="사진을 불러올 수 없습니다." /></div>`,
    )

    tapButton.insertAdjacentHTML(
      'beforeend',
      `<input type="radio" name="page" value="` + `${i + 1 + currentAllImg}` + `" />`,
    )
  }
})
