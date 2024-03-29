const regexInput = document.querySelector('.regexInput')
const regexOutput = document.querySelector('.regexResult')
const grammarArea = document.querySelector('#grammar')
const entradaDiv = document.querySelector('.entradaDiv')
const treeDiv = document.querySelector('.tree')
const toAutomataButton = document.querySelector('.to-automata')
const addRuleButton = document.querySelector('.add-rule')

function checkRegex() {
    let regexText = regexInput.value;
    if (!regexText) {
        swal("Erro", "Regex vazia.", "error");
        return null;
    }
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
 
    // Construindo o autômato na interface
    // Reseta o autômato
    automata.newthis();

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
    if(validateAllRules() === false){
        swal("Erro", "Gramática inválida.", "error");
        return;
    };
    const rules = document.querySelectorAll(".rule");
    let children, lv, rv, rvUp, rvLo, states = ['Z'], transitions = [];
    rules.forEach(rule => {
        children = rule.getElementsByTagName('input');
        lv = children[0].value;
        rv = children[1].value;
        // Se lv não for um estado, adiciona
        if(!states.includes(lv)) states.push(lv);
        rvUp = rv.match(/[A-Z]/g);
        if(rvUp) rvUp = rvUp[0];
        if(rvUp && !states.includes(rvUp)) states.push(rvUp)
        // Agora filtrando os lowercase para pegar transições
        rvLo = rv.match(/[a-z]/g);
        // Se X -> aY então δ = δ ∪ {(X,a) -> Y};
        if(rvLo && rvUp) {
            rvLo.forEach(symbol => {
                transitions.push({fromState: lv, toState: rvUp, symbol: symbol});
            });
            return;
        }

        // Se X -> a então δ = δ ∪ {(X, a) -> Z};
        if(rvLo && !rvUp) {
            rvLo.forEach(symbol => {
                transitions.push({fromState: lv, toState: 'Z', symbol: symbol});
            });
            return;
        }

        // Se X -> Y então δ = δ ∪ {(X, ε) -> Y};
        if(!rvLo && rvUp) {
            transitions.push({fromState: lv, toState: rvUp, symbol: 'λ'});
            return;
        }

        // Se X -> ε então δ = δ ∪ {(X, ε) -> Z};
        transitions.push({fromState: lv, toState: 'Z', symbol: 'λ'});
    });
    
    // Adiciona os estados
    let x = 30, y = 30;
    automata.newthis();

    states.forEach(state => {
        automata.addState(x, y, state);
        x += 100;
        if (x > 500) {
            x = 30;
            y += 100;
        }
    });

    // Adiciona as transições
    let fromState, toState;
    transitions.forEach(transition => {
        fromState = automata.findState(transition.fromState);
        toState = automata.findState(transition.toState);
        automata.addTransition(fromState, toState, transition.symbol);
    });

    // Adiciona os estados finais
    automata.findState('Z').accept = true;

    // Seta o estado inicial
    automata.setStart(automata.findState('S'));

    controller.redraw();

    grammarArea.style.display = 'none';
    
    clearRules();
}

function printGrammar(leftSide, rightSide) {
}

function transitionToRule(t) {
    if(t.symbols == 'λ') return [t.fromState.label, t.toState.label];
    return [t.fromState.label, t.symbols + t.toState.label];
}

function automataToGrammar() {
    if(automata.states.length > 26) {
        swal("Erro", "Autômato com muitos estados. Por favor, simplifique-o.", "error");
        return;
    }

    // Salva os nomes dos estados
    const stateNames = automata.states.map(state => state.label);

    // Para cada estado, seta uma letra maiúscula diferente do alfabeto
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    automata.states.forEach((state, index) => {
        state.label = alphabet[index];
    });
    // Pega o estado que está com a letra S e troca a label dele com o estado inicial
    const sState = automata.states.find(state => state.label == 'S');
    if (sState) sState.label = automata.startState.label;
    automata.startState.label = 'S';
    // Agora, vamos à construção da gramática
    let rules = [];
    // Adiciona as regras de transição
    automata.transitions.forEach(t => {
        rules.push(transitionToRule(t));
    });
    // Verifica se os estados são finais
    automata.states.forEach(state => {
        if(state.accept) rules.push([state.label, 'λ']);
    });
    
    // Coloca as regras com S na esquerda no início
    rules.sort((a, b) => {
        if(a[0] == 'S') return -1;
        if(b[0] == 'S') return 1;
        return 0;
    });

    // Adiciona as regras na tela
    clearRules();
    let rulesDivs;
    rules.forEach((rule, index) => {
        if(index !== 0) addRule();
        rulesDivs = document.querySelectorAll('.rule');
        rulesDivs[index].getElementsByTagName('input')[0].value = rule[0];
        rulesDivs[index].getElementsByTagName('input')[1].value = rule[1];
        if (rule[1] == 'λ') rulesDivs[index].getElementsByTagName('input')[1].value = '';
    });

    validateInput();

    // Restaura os nomes dos estados
    automata.states.forEach((state, index) => {
        state.label = stateNames[index];
    });
}

function clearRules() {
    // Exclui todos as rules, deixando apenas uma
    const rules = document.querySelectorAll('.rule');
    rules.forEach((rule, index) => {
        if(index !== 0) rule.remove();
    });
    rules[0].getElementsByTagName('input')[1].value = '';
    // Faz a regra ser selecionável novamente
    rules[0].style.pointerEvents = 'auto';
    rules[0].getElementsByTagName('input')[0].readOnly = false;
    rules[0].getElementsByTagName('input')[1].readOnly = false;
}

function regexToGrammar() {
    const regex_fa = new ExtendedAutomata();
    const regex = checkRegex();
    const converted = noam.re.tree.toAutomaton(regex);
    console.log(converted)
    // Adiciona os estados
    converted.states.forEach(state => {
        regex_fa.addState(0, 0, `q${state}`);
    });

    // Adiciona as transições
    let fromState, toState;
    converted.transitions.forEach(transition => {
        transition.toStates.forEach(ts => {
            fromState = regex_fa.findState(`q${transition.fromState}`);
            toState = regex_fa.findState(`q${ts}`);
            // Troca $ por lambda
            if (transition.symbol === '$') transition.symbol = 'λ';
            regex_fa.addTransition(fromState, toState, transition.symbol);
        });
    });

    // Adiciona os estados finais
    converted.acceptingStates.forEach(state => {
        regex_fa.findState(`q${state}`).accept = true;
    });

    // Seta o estado inicial
    regex_fa.setStart(regex_fa.findState(`q${converted.initialState}`));

    // Converte o autômato para gramática
    // Salva o ponteiro do autômato antigo
    const oldAutomata = automata;
    automata = regex_fa;
    automataToGrammar();
    // Restaura o autômato antigo
    automata = oldAutomata;
}

function grammarToRegex() {
    const regex_fa = new ExtendedAutomata();
    // Salva o ponteiro do autômato antigo
    const oldAutomata = automata;
    automata = regex_fa;
    grammarToAutomata();
    automataToRegex();
    // Restaura o autômato antigo
    automata = oldAutomata;
}

// Adicionando os listeners para as funções
document.querySelector('.regexButton').addEventListener('click', regexToAutomata);
document.querySelector('.automataToRegexButton').addEventListener('click', automataToRegex);
toAutomataButton.addEventListener('click', () => {
    grammarToAutomata();
    swal("Sucesso", "Gramática convertida para autômato!", "success");
});

document.querySelector('.close-button').addEventListener('click', () => {
    grammarArea.style.display = 'none';
    clearRules();
});

document.querySelector('.grammarToAutomataButton').addEventListener('click', () => {
    entradaDiv.classList.add('displayNone');
    treeDiv.classList.add('displayNone');
    grammarArea.style.display = 'block';
    toAutomataButton.style.display = 'block';
    addRuleButton.style.display = 'block';
});

document.querySelector('.automataToGrammarButton').addEventListener('click', () => {
    // Executa a função
    try {
        automataToGrammar();
    } catch (error) {
        swal("Erro", "Autômato inválido. Por favor, verifique-o.", "error");
        return;
    }
    // Mostra a interface depois de tudo pronto
    // Mostra entrada de gramática e árvore
    entradaDiv.classList.remove('displayNone');
    treeDiv.classList.remove('displayNone');
    grammarArea.style.display = 'block';
    toAutomataButton.style.display = 'none';
    addRuleButton.style.display = 'none';
    // Congela pós escrita
    const rules = document.querySelectorAll('.rule');
    let inputs;
    rules.forEach(rule => {
        inputs = rule.getElementsByTagName('input');
        inputs[0].readOnly = true;
        inputs[1].readOnly = true;
        rule.style.pointerEvents = 'none';
    });
});

document.querySelector('.regexToGrammarButton').addEventListener('click', () => {
    // Executa a função
    try {
        regexToGrammar();
    } catch (error) {
        swal("Erro", "Expressão regular inválida. Por favor, verifique-a.", "error");
        return;
    }
    // Mostra a interface depois de tudo pronto
    // Mostra entrada de gramática e árvore
    entradaDiv.classList.remove('displayNone');
    treeDiv.classList.remove('displayNone');
    grammarArea.style.display = 'block';
    toAutomataButton.style.display = 'none';
    addRuleButton.style.display = 'none';
    // Congela pós escrita
    const rules = document.querySelectorAll('.rule');
    let inputs;
    rules.forEach(rule => {
        inputs = rule.getElementsByTagName('input');
        inputs[0].readOnly = true;
        inputs[1].readOnly = true;
        rule.style.pointerEvents = 'none';
    });
});

document.querySelector('.to-regex').addEventListener('click', grammarToRegex);