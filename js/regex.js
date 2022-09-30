/*function validaTexto(e) {
    console.log(e.target.value)
}*/

function validar(regex, texto) {
    try {
        const re = new RegExp(regex);
        $('.regex-input').classList.remove('vermelho');
        if(re.test(texto)) {
            $('.text-input').classList.remove('vermelho');
            return;
        }
        $('.text-input').classList.add('vermelho');
    }
    catch(e) {
        $('.regex-input').classList.add('vermelho');
    }
}

$('.regex-input').addEventListener('input', function(e) {
    validar(e.target.value, $('.text-input').value)
});

$('.text-input').addEventListener('input', function(e) {
    validar($('.regex-input').value, e.target.value);
});