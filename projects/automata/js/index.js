// Cria o autômato base para uso
const automata = new Automata();

//const canvas = document.getElementById('canvas');
const canvas = document.createElement("canvas");
canvas.width = 659;
canvas.height = 580;
document.querySelector('.automata').appendChild(canvas);
// Com o canvas, cria o controlador de desenho
const controller = new CanvasController(canvas, automata);