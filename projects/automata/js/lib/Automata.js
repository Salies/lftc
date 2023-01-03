
class Automata {
    startState = null;
    states = [];
    transitions = [];
    // Variáveis para processamento de cadeias
    input = "";
    inputIndex = 0;

    addState(x, y,label) {
        const state = new State(x, y, 15, false, label);
        this.states.push(state);
    }

    addTransition(from, to, symbols, x = null, y = null) {
        const transition = new Transition(from, to, symbols, x, y);
        this.transitions.push(transition);
    }

    removeState(state) {
        const stateTransitions = this.transitions.filter(t => t.fromState == state || t.toState == state);
        stateTransitions.forEach(t => this.removeTransition(t));

        this.states = this.states.filter(s => s != state);

        if(state.start) this.startState = null;
    }

    removeTransition(transition) {
        this.transitions = this.transitions.filter(t => t != transition);
    }

    setStart(state) {
        // Se já existe um estado inicial...
        if(this.startState != null) this.startState.start = false;
        this.startState = state;
        state.start = true;
    }

    reset(input = null) {
        if(input != null)
            this.input = input;
        this.inputIndex = 0;

        const elements = this.states.concat(this.transitions);
        elements.forEach(e => e.current = false);

        this.startState.current = true;
        this.processEpsilons();
    }

    step() {
        const symbol = this.input.charAt(this.inputIndex);
        let currentTransitions = [];
        //Find all transitions that will be traveled with this step
        for(let transition of this.transitions) {
            if(transition.symbols.includes(symbol) && transition.fromState.current) {
                currentTransitions.push(transition);
                transition.current = true;
                continue;
            }

            transition.current = false;
        }

        //Remove previous states first...
        this.states.forEach(s => s.current = false);
        
        //Then set the new current states
        currentTransitions.forEach(t => t.toState.current = true);

        this.processEpsilons();
    }

    //Processes epsilon transitions without consuming the next symbol.
    processEpsilons() {
        let epsilonTransitions = [];
        
        epsilonTransitions = this.transitions.filter(t => t.symbols.includes("λ"));

        let updated = true;

        while(updated) {
            updated = false;

            for(let transition of epsilonTransitions) {
                if(!transition.fromState.current) continue;
                transition.current = true;

                if(!transition.toState.current) {
                    transition.toState.current = true;
                    updated = true;
                }
            }
        }
    }

    //Returns the state of this this with the given label,
    //or null if such a state does not exist.
    findState(label) {
        return this.states.find(s => s.label == label);
    }

    //Deletes all states and transitions, leaving a blank canvas.
    newthis() {
        this.startState = null;
        this.states.length = 0;
        this.transitions.length = 0;
        this.input = "";
        this.inputIndex = 0;
    }

    //Returns a string representation of the current this
    // TODO: refazer no formato da lib de conversão
    toString() {
        let out = [];
        out.push("States");
        for(let s of this.states) {
            let line = [];
            line.push(s.x,s.y,s.start,s.accept,s.label);
            out.push(line.join());
        }
        out.push("Transitions");
        for(let t of this.transitions) {
            let line = [];
            line.push(t.fromState.label,t.toState.label,t.symbols,t.x,t.y);
            out.push(line.join());
        }
        return out.join("\n");
    }
}

