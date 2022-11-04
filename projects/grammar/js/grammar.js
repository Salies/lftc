const list = $('.list');
const pattern = new RegExp("^[a-z]*[A-Z]?$");
$('.add-rule').addEventListener('click', () => {
    list.innerHTML += '</br><input type="text"> → <input type="text">';
})

function validateRule(el) {
    if (pattern.test(el.value)) {
        el.classList.remove('red');
        return true;
    } else {
        el.classList.add('red');
        return false;
    }
}

function validateInput() {
    // get all inputs with class 'rule'
    const inputs = document.querySelectorAll('.rule');
    const allValidInput = Array.from(inputs).every(validateRule);
    console.log(allValidInput);
}