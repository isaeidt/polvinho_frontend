async function loadSubject() {
	if (window.location.pathname !== '/disciplina') {
		return;
	}

	const voltarButton = document.getElementById('icone_voltar');
	const titulo = document.querySelector('h1');

	if (voltarButton) {
		voltarButton.onclick = () => {
			localStorage.removeItem('subjectId');
			window.history.back();
		};
	}

	const subjectData = localStorage.getItem('subjectId');
	const subject = subjectData ? JSON.parse(subjectData) : null;

	if (titulo && subject && subject.name) {
		titulo.innerHTML = subject.name;
	} else {
		titulo.innerHTML = 'Matéria não encontrada';
	}
}

window.addEventListener('page-rendered', loadSubject);

loadSubject();
