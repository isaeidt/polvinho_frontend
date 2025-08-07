async function loadCadastrados() {
	const path = window.location.pathname;

	if (path === '/alunos-cadastrados') {
		const response = await fetch(`http://localhost:3030/api/all/aluno`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshUsersData = await response.json();
		console.log('🚀 ~ loadCadastrados ~ freshUsersData:', freshUsersData);
		const totalContainer = document.getElementById('total-cadastrados');
		const total = Object.keys(freshUsersData).length;
		totalContainer.innerHTML = `${total} cadastrados`;

		for (const alunos of freshUsersData) {
			const container = document.querySelector('.cadastrados');
			const alunoElement = document.createElement('p');
			alunoElement.className = 'aluno-item';
			alunoElement.innerHTML = `
                    <span>${alunos.registration || 'N/A'}</span>
                    <span>${alunos.name || 'Nome não informado'}</span>
                    <span>${alunos.subjects.length}</span>
					<span>Editar</span>
					<span>Excluir</span>
                `;
			container.appendChild(alunoElement);
		}
	}

	if (path === '/professores-cadastrados') {
		const response = await fetch(
			`http://localhost:3030/api/all/professor`,
			{
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshUsersData = await response.json();
		const totalContainer = document.getElementById('total-cadastrados');
		const total = Object.keys(freshUsersData).length;
		totalContainer.innerHTML = `${total} cadastrados`;

		for (const professores of freshUsersData) {
			const container = document.querySelector('.cadastrados');
			const professorElement = document.createElement('p');
			professorElement.className = 'professor-item';
			professorElement.innerHTML = `
                    <span>${professores.registration || 'N/A'}</span>
                    <span>${professores.name || 'Nome não informado'}</span>
                    <span>${professores.subjects.length}</span>
					<span>Editar</span>
					<span>Excluir</span>
                `;
			container.appendChild(professorElement);
		}
	}
	if (path === '/disciplinas-cadastradas') {
		const response = await fetch(`http://localhost:3030/api/all/subject`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshUsersData = await response.json();
		const totalContainer = document.getElementById('total-cadastrados');
		const total = Object.keys(freshUsersData).length;
		totalContainer.innerHTML = `${total} cadastradas`;

		for (const disciplinas of freshUsersData) {
			const container = document.querySelector('.cadastrados');
			const disciplinaElement = document.createElement('p');
			disciplinaElement.className = 'disciplina-item';
			disciplinaElement.innerHTML = `
                    <span>${disciplinas.name || 'Nome não informado'}</span>
                    <span>${disciplinas.professor}</span>
					<span>0</span>
					<span>Editar</span>
					<span>Excluir</span>
                `;
			container.appendChild(disciplinaElement);
		}
	}

	const voltarButton = document.getElementById('icone_voltar');

	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}
}

window.addEventListener('page-rendered', loadCadastrados);

loadCadastrados();
