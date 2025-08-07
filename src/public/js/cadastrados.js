async function loadCadastrados() {
	const path = window.location.pathname;

	if (
		path === '/alunos-cadastrados' ||
		path === '/professores-cadastrados' ||
		path === '/disciplinas-cadastradas'
	);

	const voltarButton = document.getElementById('icone_voltar');

	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}
}

window.addEventListener('page-rendered', loadCadastrados);

loadCadastrados();
