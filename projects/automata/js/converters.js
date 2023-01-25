const regexInput = document.getElementsByClassName('regexInput')[0];

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
}

// Adicionando os listeners para as funções
document.querySelector('.regexButton').addEventListener('click', regexToAutomata);