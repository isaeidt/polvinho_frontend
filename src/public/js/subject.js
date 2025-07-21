const voltar = document.getElementById('icone_voltar');

voltar.addEventListener('click', () => {
	window.location.assign(
		'http://127.0.0.1:5501/src/public/html/dashboard.html',
	);
});
