/*function validaTexto(e) {
    console.log(e.target.value)
}*/

function validar(regex, texto) {
    try {
        const re = new RegExp(regex);
        $('.regex-input').classList.remove('vermelho');
        return re.test(texto);
    }
    catch(e) {
        $('.regex-input').classList.add('vermelho');
    }
}

$('.regex-input').addEventListener('input', function(e) {
    let a = validar(e.target.value, $('.text-input').value);
    console.log(a)
});

$('.text-input').addEventListener('input', function(e) {
    let a = validar($('.regex-input').value, e.target.value);
    console.log(a)
});