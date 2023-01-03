
/*
This class handles drawing elements to the canvas and
user input on the canvas.
*/
class CanvasController {
    constructor(canvas, fa) {
        this.fa = fa;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.font = "20px serif";

        this.mousePressed = false;
        this.ctrlPressed = false;
        this.selected = [];

        //This contains the different types of menus.
        this.menuContainer = null;
        this.menuContainer = document.createElement("div");
        this.menuContainer.classList.add("menu-wrapper");

        const menuOptionsNames = ['Adicionar estado', 'Remover estado', 'Adicionar transição', 'Remover transição', 'Final', 'Definir como inicial'];
        let menuOptions = {};
        menuOptionsNames.forEach((optionName) => {
            menuOptions[optionName] = document.createElement('div');
            menuOptions[optionName].innerText = optionName;
            menuOptions[optionName].classList.add('menuItem');
        });

        // O menu de definir como final é criado separadamente porque ele é um checkbox.
        const setFinalCheckbox = document.createElement('input');
        setFinalCheckbox.type = 'checkbox';
        setFinalCheckbox.id = 'setFinalCheckbox';
        menuOptions['Final'].appendChild(setFinalCheckbox);

        // Construindo o menu para clique em um lugar vazio da tela.
        this.defaultMenu = document.createElement('div');
        this.defaultMenu.appendChild(menuOptions['Adicionar estado']);

        // Construindo o menu para clique em um estado.
        this.stateMenu = document.createElement('div');
        this.stateMenu.appendChild(menuOptions['Remover estado']);
        this.stateMenu.appendChild(menuOptions['Adicionar transição']);
        this.stateMenu.appendChild(menuOptions['Final']);
        this.stateMenu.appendChild(menuOptions['Definir como inicial']);

        // Construindo o menu para clique em uma transição.
        this.transitionMenu = document.createElement('div');
        this.transitionMenu.appendChild(menuOptions['Remover transição']);

        this.addStateMenu = document.createElement('div');
        const { stateCreateButton, stateCancelButton } = this.createStateCreationUI();

        this.addTransitionMenu = document.createElement('div');
        const { transitionCreateButton, transitionCancelButton } = this.createTransitionCreationUI();

        //Register event listeners
        this.canvas.addEventListener("mousemove", this.mouseMoveHandle);
        this.canvas.addEventListener("mousedown", this.mouseDownHandle);
        this.canvas.addEventListener("mouseup", this.mouseUpHandle);
        this.canvas.addEventListener("contextmenu", this.openMenu);
        
        const docHtml = document.getElementsByTagName("html")[0];

        docHtml.addEventListener("keydown", this.onKeyDown);
        docHtml.addEventListener("keyup", this.onKeyUp);

        menuOptions['Adicionar estado'].addEventListener("click", this.openAddStateMenu);
        stateCreateButton.addEventListener("click", this.createState);
        stateCancelButton.addEventListener("click", this.cancelStateCreate);
        setFinalCheckbox.addEventListener("click", this.toggleFinal);
        menuOptions['Definir como inicial'].addEventListener("click", this.makeStart);
        menuOptions['Adicionar transição'].addEventListener("click", this.openAddTransitionMenu);
        transitionCreateButton.addEventListener("click", this.createTransition);
        transitionCancelButton.addEventListener("click", this.cancelTransitionCreate);
        menuOptions['Remover estado'].addEventListener("click", this.deleteState);
        menuOptions['Remover transição'].addEventListener("click", this.deleteTransition);
    }

    // Cria a interface de criação de estados.
    createStateCreationUI() {
        // Marcação de estado final
        const finalDiv = document.createElement('div');
        const finalLabel = document.createElement('label');
        finalLabel.innerText = 'Final';
        const finalInput = document.createElement('input');
        finalInput.id = 'stateAcceptInput';
        finalInput.type = 'checkbox';
        finalDiv.appendChild(finalInput);
        finalDiv.appendChild(finalLabel);

        // Marcação de estado inicial
        const initialDiv = document.createElement('div');
        const initialLabel = document.createElement('label');
        initialLabel.innerText = 'Inicial';
        const initialInput = document.createElement('input');
        initialInput.id = 'stateStartInput';
        initialInput.type = 'checkbox';
        initialDiv.appendChild(initialInput);
        initialDiv.appendChild(initialLabel);

        // Nome do estado
        const nameDiv = document.createElement('div');
        const nameLabel = document.createElement('label');
        nameLabel.innerText = 'Nome do estado:';
        const nameInput = document.createElement('input');
        nameInput.id = 'stateLabelInput';
        nameInput.type = 'text';
        nameDiv.appendChild(nameLabel);
        nameDiv.appendChild(nameInput);

        // Botão de criação
        const createButton = document.createElement('button');
        createButton.innerText = 'Criar';
        createButton.id = 'stateCreateButton';

        // Botão de cancelamento
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancelar';
        cancelButton.id = 'stateCancelButton';

        // Div para os botões
        const buttonDiv = document.createElement('div');
        buttonDiv.appendChild(createButton);
        buttonDiv.appendChild(cancelButton);

        // Montando a interface
        this.addStateMenu.classList.add('menuItem');
        this.addStateMenu.appendChild(nameDiv);
        this.addStateMenu.appendChild(finalDiv);
        this.addStateMenu.appendChild(initialDiv);
        this.addStateMenu.appendChild(buttonDiv);

        return { stateCreateButton: createButton, stateCancelButton: cancelButton }
    }

    // Cria a interface de criação de transições.
    createTransitionCreationUI() {
        // Para qual estado?
        const toStateDiv = document.createElement('div');
        const toStateLabel = document.createElement('label');
        toStateLabel.innerText = 'Para:';
        const toStateInput = document.createElement('input');
        toStateInput.id = 'targetInput';
        toStateInput.type = 'text';
        toStateDiv.appendChild(toStateLabel);
        toStateDiv.appendChild(toStateInput);

        // Qual símbolo?
        const symbolDiv = document.createElement('div');
        const symbolLabel = document.createElement('label');
        symbolLabel.innerText = 'Símbolo:';
        const symbolInput = document.createElement('input');
        symbolInput.id = 'symbolInput';
        symbolInput.type = 'text';
        symbolDiv.appendChild(symbolLabel);
        symbolDiv.appendChild(symbolInput);

        // Div dos botões
        const buttonDiv = document.createElement('div');

        // Botão de criação
        const createButton = document.createElement('button');
        createButton.innerText = 'Criar';
        createButton.id = 'transitionCreateButton';

        // Botão de cancelamento
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancelar';
        cancelButton.id = 'transitionCancelButton';

        // Adicionando os botões à div
        buttonDiv.appendChild(createButton);
        buttonDiv.appendChild(cancelButton);

        // Montando a interface
        this.addTransitionMenu.classList.add('menuItem');
        this.addTransitionMenu.appendChild(toStateDiv);
        this.addTransitionMenu.appendChild(symbolDiv);
        this.addTransitionMenu.appendChild(buttonDiv);

        return { transitionCreateButton: createButton, transitionCancelButton: cancelButton }
    }

    //Checks where the right mouse button was clicked,
    //and opens the appropriate menu.
    openMenu = (e) => {
        e.preventDefault();
        this.menuContainer.x = e.offsetX;
        this.menuContainer.y = e.offsetY;
        this.menuContainer.selected = this.checkForElement(e.offsetX, e.offsetY);

        if (this.menuContainer.selected == null)
            this.menuContainer.appendChild(this.defaultMenu);
        else if (this.menuContainer.selected instanceof State)
            this.menuContainer.appendChild(this.stateMenu);
        else if (this.menuContainer.selected instanceof Transition)
            this.menuContainer.appendChild(this.transitionMenu);

        this.menuContainer.style.top = `${e.offsetY}px`;
        this.menuContainer.style.left = `${e.offsetX}px`;

        document.getElementById("canvasDiv").appendChild(this.menuContainer);
        if (this.menuContainer.selected instanceof State)
            document.querySelector("#setFinalCheckbox").checked = this.menuContainer.selected.accept;

        this.redraw()
    }

    closeMenu = () => {
        if (!this.menuContainer.parentNode) return;

        this.menuContainer.parentNode.removeChild(this.menuContainer);
        this.menuContainer.removeChild(this.menuContainer.firstChild);
    }

    openAddStateMenu = () => {
        this.closeMenu();
        this.menuContainer.appendChild(this.addStateMenu);
        document.getElementById("canvasDiv").appendChild(this.menuContainer);
        this.redraw();
    }

    createState = () => {
        const label = document.getElementById("stateLabelInput");
        const previousLabelValue = label.value;

        if (previousLabelValue == "") {
            alert("Error: The state label cannot be blank.")
            return;
        }

        // Verifica se já existe um estado com o mesmo nome
        if (this.fa.findState(previousLabelValue) != null) {
            alert("Error: A state already exists with label " + previousLabelValue + ".");
            return;
        }

        this.fa.addState(this.menuContainer.x, this.menuContainer.y, previousLabelValue);

        this.redraw();
        this.closeMenu();

        //Limpando o input
        label.value = "";
    }

    //Cancels the creation for both the addStateMenu
    cancelStateCreate = () => {
        //Clear addStateMenu inputs
        document.getElementById("stateLabelInput").value = "";
        this.closeMenu();
    }

    toggleFinal = (e) => {
        this.menuContainer.selected.accept = e.target.checked;
        this.redraw();
        this.closeMenu();
    }

    makeStart = () => {
        this.fa.setStart(this.menuContainer.selected);
        this.redraw();
        this.closeMenu();
    }

    //Deletes all transitions connected to the selected state,
    //then deletes the state.
    deleteState = () => {
        this.fa.removeState(this.menuContainer.selected);
        this.redraw();
        this.closeMenu();
    }

    openAddTransitionMenu = () => {
        this.closeMenu();
        this.menuContainer.appendChild(this.addTransitionMenu);
        document.getElementById("canvasDiv").appendChild(this.menuContainer);
        this.redraw();
    }

    createTransition = () => {
        const previousToState = document.getElementById("targetInput");
        const previousToStateName = previousToState.value;

        const toState = this.fa.findState(previousToStateName);

        const symbols = document.getElementById("symbolInput");
        let previousSymbols = symbols.value;

        if (previousToStateName == "") {
            alert("Error: The state label cannot be blank.");
            return;
        }

        if (toState == null) {
            alert("Error: There is no state with label " + previousToStateName + ".");
            return;
        }

        if (previousSymbols == "")
            previousSymbols = "λ";

        this.fa.addTransition(this.menuContainer.selected, toState, previousSymbols);

        this.redraw();
        this.closeMenu();

        // Limpando os inputs
        previousToState.value = "";
        symbols.value = "";
    }

    cancelTransitionCreate = () => {
        //Clear addTransitionMenu inputs
        document.getElementById("targetInput").value = "";
        document.getElementById("symbolInput").value = "";
        this.closeMenu();
    }

    //Deletes the selected transition
    deleteTransition = () => {
        this.fa.removeTransition(this.menuContainer.selected);
        this.redraw();
        this.closeMenu();
    }

    //Clears the canvas and draws all components of the FA.
    redraw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Junta os estados e as transições do autômato, a serem desenhados, em uma lista
        const elements = this.fa.states.concat(this.fa.transitions);
        elements.forEach(e => e.draw(this.ctx));

        if (this.selectionBoxX == null) return;

        this.ctx.beginPath();
        this.ctx.moveTo(this.selectionBoxX, this.selectionBoxY);
        this.ctx.lineTo(this.selectionBoxX, this.lastY);
        this.ctx.lineTo(this.lastX, this.lastY);
        this.ctx.lineTo(this.lastX, this.selectionBoxY);
        this.ctx.lineTo(this.selectionBoxX, this.selectionBoxY);
        this.ctx.stroke();
    }

    // Reescrever a partir daqui
    mouseUpHandle = (e) => {
        if(this.selectionBoxX != null) {
            this.checkForElements(this.selectionBoxX,this.selectionBoxY,this.lastX,this.lastY);
            this.selectionBoxX = null;
            this.selectionBoxY = null;
        }
        else if(!this.ctrlPressed)
            this.selected.length = 0;

        this.mousePressed = false;
    }

    mouseMoveHandle = (e) => {
        this.deltaX = e.offsetX-this.lastX;
        this.deltaY = e.offsetY-this.lastY;
        this.lastX = e.offsetX;
        this.lastY = e.offsetY;
        
        if(!this.mousePressed) return;

        this.selected.forEach(e => e.move(e.x + (this.deltaX),e.y + (this.deltaY)));
        
        this.redraw();
    }

    mouseDownHandle = (e) => {
        this.closeMenu();

        if(e.button != 0) return;

        this.mousePressed = true;

        const target = this.checkForElement(e.offsetX,e.offsetY);

        if(target != null && !this.selected.includes(target)) {
            this.selected.push(target)
            return;
        }

        if(this.ctrlPressed) return;

        this.selected.length = 0;
        this.selectionBoxX = e.offsetX;
        this.selectionBoxY = e.offsetY;
    }

    onKeyDown = (e) => {
        if (e.key != "Control") return;
        this.ctrlPressed = true;
    }

    onKeyUp = (e) => {
        if (e.key != "Control") return;
        this.selected.length = 0;
        this.ctrlPressed = false;
        this.redraw();
    }

    checkForElement = (x, y) => {
        for (let s of this.fa.states) {
            if (x < (s.x + s.radius) && x > (s.x - s.radius) && y < (s.y + s.radius) && y > (s.y - s.radius))
                return s;
        }

        for (let t of this.fa.transitions) {
            if (x < (t.x + (t.symbols.length * 10) / 2) && x > (t.x - (t.symbols.length * 10) / 2) && y < (t.y + 6) && y > (t.y - 6))
                return t;
        }

        return null;
    }

    // Marca elementos selecionados
    checkForElements(x1, y1, x2, y2) {
        const [xMin, yMin, xMax, yMax] = [Math.min(x1,x2), Math.min(y1,y2), Math.max(x1,x2), Math.max(y1,y2)];

        const elements = this.fa.states.concat(this.fa.transitions).filter(e => xMin < e.x && e.x < xMax && yMin < e.y && e.y < yMax);
        this.selected = this.selected.concat(elements);
    }
}