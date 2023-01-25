
// Cria o autômato base para uso
let automata = new ExtendedAutomata();

// Criando um canvas e colocando ele dentro da div
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

// Colore a div da string de verdde
const setAsPassed = () => {
    resultDiv.classList.add('passed');
}
    
// Colore a div da string de vermelho
const setAsRejected = () => {
    resultDiv.classList.add('rejected');
}

// Verifica se há um estado inicial no autômato.
// Se tiver, então o percurso pode começar.
const checkStart = () => {
    if (automata.startState !== null) return true;
    setWarning('É necessário definir um estado inicial!');
    return false;
}

// Define a string de entrada para percurso no autômato.
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

// Faz um passo na validação da string no autômato.
const step = () => {
    if(automata.states.filter(state => state.current).length === 0){
        setAsRejected();
        resultDiv.childNodes[automata.inputIndex - 1].classList.remove('current');
        return;
    }

    // Retira o destaque do anterior
    if(automata.inputIndex > 0)
        resultDiv.childNodes[automata.inputIndex - 1].classList.remove('current');
    
    // Faz o passo no próximo
    if (automata.inputIndex < automata.input.length) {
        automata.step();
        controller.redraw();
        resultDiv.childNodes[automata.inputIndex].classList.add('current');
        automata.inputIndex++;
        return;
    }

    // Está no último caractere da string. Verificar se a string passou.
    // Lembrando que se algum dos caracteres não tiver transição,
    // o autômato vai para um estado de erro, e não passa no final.
    const pass = automata.states.some(state => state.current && state.accept);

    if (pass) {
        setAsPassed();
        return;
    }

    setAsRejected();
}

// Reinicia os passos com a string atual.
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

const clean = () => {
    automata.newthis();
    controller.redraw();
    resultDiv.innerHTML = '';
    resultDiv.classList.remove('passed');
    resultDiv.classList.remove('rejected');
    stepUserString.value = '';
}

// Sincroniza as funções com os botões da interface.
setInputBtn.addEventListener('click', setString);
stepBtn.addEventListener('click', step);
resetBtn.addEventListener('click', reset);
$('.cleanup').addEventListener('click', clean);