async function loadCadastrar() {
	const isCadastrarPage = window.location.pathnam === '/cadastrar';
	if (!isCadastrarPage) {
		return;
	}

	const voltarButton = document.getElementById('icone_voltar');
	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}
}
window.addEventListener('page-rendered', loadCadastrar);

loadCadastrar();
