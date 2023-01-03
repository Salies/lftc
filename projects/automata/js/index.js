
// Cria o autômato base para uso
const automata = new Automata();

//const canvas = document.getElementById('canvas');
const canvas = document.createElement("canvas");
canvas.width = 659;
canvas.height = 580;
$('.automata').appendChild(canvas);
// Com o canvas, cria o controlador de desenho
// A partir desta chamada o desenho já está funcional.
const controller = new CanvasController(canvas, automata);

// Botões de controle do passo a passo
const setInputBtn = $('.simStringButton'),
    stepBtn = $('.simStep'),
    resetBtn = $('.simReset'),
    resultDiv = $('.simResult'),
    stringInput = $('.simStringInput');

const setAsPassed = () => {
    resultDiv.classList.add('passed');
}
    
const setAsRejected = () => {
    resultDiv.classList.add('rejected');
}

const checkStart = () => {
    if (automata.startState !== null) return true;
    setWarning('É necessário definir um estado inicial!');
    return false;
}

const setString = () => {
    if (!checkStart()) return;
    automata.reset(stringInput.value);
    controller.redraw();
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('passed');
    resultDiv.classList.remove('rejected');
    [...(stringInput.value)].forEach(char => {
        resultDiv.innerHTML += `<span>${char}</span>`
    });
    stringInput.value = '';
}

const step = () => {
    if(automata.inputIndex > 0)
        resultDiv.childNodes[automata.inputIndex - 1].style.color = "black";
    
    if (automata.inputIndex < automata.input.length) {
        automata.step();
        controller.redraw();
        resultDiv.childNodes[automata.inputIndex].style.color = 'blue';
        automata.inputIndex++;
        return;
    }

    // Está no último caractere da string
    // Lembrando que se algum dos caracteres não tiver transição,
    // o autômato vai para um estado de erro, e não passa no final.
    let pass = false;
    for(let state of automata.states) {
        if (state.current && state.accept) {
            pass = true;
            break;
        }
    }

    if (pass) {
        setAsPassed();
        return;
    }

    setAsRejected();
}

const reset = () => {
    if(!checkStart()) return;

    automata.reset();
    controller.redraw();

    resultDiv.classList.remove('passed');
    resultDiv.classList.remove('rejected');
    resultDiv.innerHTML = '';
}

setInputBtn.addEventListener('click', setString);
stepBtn.addEventListener('click', step);
resetBtn.addEventListener('click', reset);