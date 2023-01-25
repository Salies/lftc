const regexInput = document.querySelector('.regexInput')
const regexOutput = document.querySelector('.regexResult')

function checkRegex() {
    let regexText = regexInput.value;
    // Tratando o regex para ser aceito pela biblioteca
    // Remove ^ e $
    regexText = regexText.replace(/\^/g, '');
    regexText = regexText.replace(/\$/g, '');
    // Se houver |, troca por +
    regexText = regexText.replace(/\|/g, '+');
    // Se houver ?, troca por +$
    regexText = regexText.replace(/\?/g, '+$');
    let regex;
    try {
        regex = noam.re.string.toTree(regexText);
        return regex;
    } catch(e) {
        swal("Erro", "Regex inválida", "error");
        return null;
    }
}

function regexToAutomata() {
    const regex = checkRegex();
    if (!regex) return;

    const converted = noam.re.tree.toAutomaton(regex);
    console.log(converted)
 
    // Construindo o autômato na interface
    // Reseta o autômato
    automata.newthis();
    controller.redraw();

    let x = 30, y = 30;

    // Adiciona os estados
    converted.states.forEach(state => {
        automata.addState(x, y, `q${state}`);
        x += 100;
        if (x > 500) {
            x = 30;
            y += 100;
        }
    });
    
    // Adiciona as transições
    let fromState, toState;
    converted.transitions.forEach(transition => {
        transition.toStates.forEach(ts => {
            fromState = automata.findState(`q${transition.fromState}`);
            toState = automata.findState(`q${ts}`);
            // Troca $ por lambda
            if (transition.symbol === '$') transition.symbol = 'λ';
            automata.addTransition(fromState, toState, transition.symbol);
        });
    });

    // Adiciona os estados finais
    converted.acceptingStates.forEach(state => {
        automata.findState(`q${state}`).accept = true;
    });

    // Seta o estado inicial
    automata.setStart(automata.findState(`q${converted.initialState}`));

    controller.redraw();
}

function automataToRegex() {
    const automataString = automata.toString();
    let fsm, regex;
    try {
        fsm = noam.fsm.parseFsmFromString(automataString);
        fsm = noam.fsm.minimize(fsm);
        regex = noam.fsm.toRegex(fsm);
        regex = noam.re.tree.simplify(regex, {"useFsmPatterns": true});
        regex = noam.re.tree.toString(regex);
        // Substitui + por |, +$ por ?
        regex = regex.replace(/\+/g, '|');
        regex = regex.replace(/\+\$/g, '?');
        regexOutput.value = regex;
    } catch(error) {
        swal("Erro", "Autômato inválido", "error");
        return;
    }
}

function grammarToAutomata() {
    if(validateAllRules() === false) return;
    console.log('bora!!!')
    const rules = document.querySelectorAll(".rule");
    let children;
    rules.forEach(rule => {
        children = rule.getElementsByTagName('input');
        console.log(children[0].value, children[1].value)
    });
}

// Adicionando os listeners para as funções
document.querySelector('.regexButton').addEventListener('click', regexToAutomata);
document.querySelector('.automataToRegexButton').addEventListener('click', automataToRegex);
document.querySelector('.to-automata').addEventListener('click', grammarToAutomata);
document.querySelector('.grammar-close').addEventListener('click', () => {
    document.querySelector('#grammar').style.display = 'none';
});