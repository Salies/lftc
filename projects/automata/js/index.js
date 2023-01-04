
// Cria o autômato base para uso
const automata = new Automata();

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
    stepUserString = $('.simStringInput');

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
    automata.reset(stepUserString.value);
    controller.redraw();
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('passed');
    resultDiv.classList.remove('rejected');
    [...(stepUserString.value)].forEach(char => {
        resultDiv.innerHTML += `<span>${char}</span>`
    });
    stepUserString.value = '';
}

const step = () => {
    if(automata.inputIndex > 0)
        resultDiv.childNodes[automata.inputIndex - 1].classList.remove('current');
    
    if (automata.inputIndex < automata.input.length) {
        automata.step();
        controller.redraw();
        resultDiv.childNodes[automata.inputIndex].classList.add('current');
        automata.inputIndex++;
        return;
    }

    // Está no último caractere da string
    // Lembrando que se algum dos caracteres não tiver transição,
    // o autômato vai para um estado de erro, e não passa no final.
    const pass = automata.states.some(state => state.current && state.accept);

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
    // Remove a classe current do span atual, se houver
    if (automata.inputIndex > 0)
        resultDiv.childNodes[automata.inputIndex - 1].classList.remove('current');
}

setInputBtn.addEventListener('click', setString);
stepBtn.addEventListener('click', step);
resetBtn.addEventListener('click', reset);