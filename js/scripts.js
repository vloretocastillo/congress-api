
const changeText = (thisButton) => {
    const isTextVisible = !$("#toggleText").is(':visible')
    const readToggleButton = document.getElementById(thisButton.id)
    isTextVisible ? readToggleButton.innerHTML = 'Read Less' : readToggleButton.innerHTML = 'Read More'
}
