let lista = $('.lista');

$('.add-regra').addEventListener('click', ()=>{
    lista.innerHTML += '</br><input type="text"> → <input type="text">';
})