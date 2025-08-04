const voltar = document.getElementById('icone_voltar');

if (voltar) {
	voltar.addEventListener('click', () => {
		window.history.back();
	});
}
