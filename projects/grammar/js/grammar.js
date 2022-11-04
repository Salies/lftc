const list = $('.list');
const pattern = new RegExp("^[a-z]*[A-Z]?$");
$('.add-rule').addEventListener('click', (e) => {
    list.insertAdjacentHTML('beforeend', '</br><input type="text"> → <input type="text" class="rule" placeholder="λ" oninput="validateRule(this)">');
})

function validateRule(el) {
    const valid = pattern.test(el.value);
    if (valid) {
        el.classList.remove('red');
    } else {
        el.classList.add('red');
    }
    validateInput();
    return valid;
}

const validateAllRules = () => {
    const rules  = document.querySelectorAll('.rule')
    let allValid = true;
    for (let i = 0; i < rules.length; i++) {
        const validRule = pattern.test(rules[i].value);
        if (!validRule) {
            rules[i].classList.add('red');
            allValid = false;
            break;
        }
    }
    return allValid;
}

function validateInput() {
    // get all inputs with class 'rule'
    const input = $('.input');
    const validRules = validateAllRules();
    console.log(validRules);
}