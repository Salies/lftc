const $ = document.querySelector.bind(document);

const warningsDiv = $('.warnings');

const setWarning = (msg) => {
    swal("Erro", msg, "error");
}