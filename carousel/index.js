const inputValue = document.getElementById('numberToChange')
const addNumber = document.getElementById('add')
const subNumber = document.getElementById('sub')
let ImgBox = document.getElementById('imageContainer')
const newImg = document.querySelector('.plus')
const plusSection = document.getElementById('plusSection')

const a = '<div>asdf<div/>'

addNumber.onclick = () => {
  let numberToAdd = parseInt(inputValue.value, 10)
  inputValue.value = ''
  console.log(ImgBox)
  for (let i = 0; i < numberToAdd; i++) {
    plusSection.innerHTML = a
    console.log(plusSection)
  }
}
