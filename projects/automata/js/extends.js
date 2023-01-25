// Extendo o toString do autômato
class ExtendedAutomata extends Automata {
    toString() {
        // Construindo o alfabeto do autômato
        let alphabet = [], symbol;
        this.transitions.forEach(transition => {
            if(alphabet.includes(transition.symbols) || transition.symbols === 'λ') return;

            symbol = transition.symbols;

            alphabet.push(symbol);
        });

        alphabet = alphabet.join('\n');

        let string = '#states\n';
        this.states.forEach(state => {
            string += state.label + '\n';
        });
        string += '#initial\n';
        string += this.startState.label + '\n';
        string += '#accepting\n';
        this.states.forEach(state => {
            if (state.accept) string += state.label + '\n';
        });
        string += `#alphabet\n${alphabet}\n#transitions\n`;
        this.transitions.forEach(transition => {
            string += `${transition.fromState.label}:${transition.symbols === 'λ' ? '$' : transition.symbols}>${transition.toState.label}\n`;
        });

        // Remove a última quebra de linha
        string = string.slice(0, -1);

        return string;
    }
}