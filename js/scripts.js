
const changeText = (thisButton) => {
    const isTextVisible = !$("#collapseExample").is(':visible')
    const readToggleButton = document.getElementById(thisButton.id)
    isTextVisible ? readToggleButton.innerHTML = 'Read Less' : readToggleButton.innerHTML = 'Read More'
}
