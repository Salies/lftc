function validar(regex, texto) {
	try {
		const re = new RegExp(regex);
		$('.regex-input').classList.remove('bg-red-400');
		if (re.test(texto)) {
			$('.text-input').classList.remove('bg-red-400');
			return;
		}
		$('.text-input').classList.add('bg-red-400');
	} catch (e) {
		$('.regex-input').classList.add('bg-red-400');
	}
}

$('.regex-input').addEventListener('input', function (e) {
	validar(e.target.value, $('.text-input').value);
});

$('.text-input').addEventListener('input', function (e) {
	validar($('.regex-input').value, e.target.value);
});
