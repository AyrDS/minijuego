const btnInit = document.querySelector('.btn-init');
const inputName = document.querySelector('.input-name');
const form = document.querySelector('form');
let valueCheck = false;
const urlOrigin = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
    btnInit.disabled = true;
});

inputName.addEventListener('input', (e) => {
    if (e.target.value.length > 0 && valueCheck === true) {
        btnInit.disabled = false;
    } else {
        btnInit.disabled = true;
    }
});

btnInit.addEventListener('click', () => {
    localStorage.setItem('user-experta', inputName.value);
    window.location.href = `${urlOrigin}/game.html`
});

form.addEventListener('submit', (e) => e.preventDefault());

function checkRadio() {
    const manLabel = document.querySelector('.manPlayerLabel');
    const womanLabel = document.querySelector('.womanPlayerLabel');
    let player = document.getElementsByName('playerSelect');
    if (player[0].checked) {
        const valueRadio = player[0].value;
        valueCheck = true;
        if (inputName.value.length > 0) {
            btnInit.disabled = false;
        }
        manLabel.classList.add('manSelect');
        womanLabel.classList.remove('womanSelect');
        localStorage.setItem('playerSelected', valueRadio);
    } else if (player[1].checked) {
        const valueRadio = player[1].value;
        valueCheck = true;
        if (inputName.value.length > 0) {
            btnInit.disabled = false;
        }
        womanLabel.classList.add('womanSelect');
        manLabel.classList.remove('manSelect');
        localStorage.setItem('playerSelected', valueRadio);
    }
};

