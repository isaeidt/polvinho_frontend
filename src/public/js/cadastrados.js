async function loadCadastrados() {
	const path = window.location.pathname;

	const paginasPermitidas = [
		'/alunos-cadastrados',
		'/professores-cadastrados',
		'/disciplinas-cadastradas',
	];
	if (!paginasPermitidas.includes(path)) {
		return;
	}

	if (path === '/alunos-cadastrados') {
		const response = await fetch(`http://localhost:3030/api/all/aluno`, {
			cache: 'no-store',
		});
		if (!response.ok)
			throw new Error(`Erro na API: ${response.statusText}`);

		const freshUsersData = await response.json();
		const alunosAtivos = freshUsersData.filter(user => !user.is_deleted);

		const totalContainer = document.getElementById('total-cadastrados');
		totalContainer.innerHTML = `${alunosAtivos.length} cadastrados`;

		const container = document.querySelector('.cadastrados');
		container.innerHTML = '';

		for (const aluno of alunosAtivos) {
			const alunoElement = document.createElement('p');
			alunoElement.className = 'aluno-item';
			alunoElement.dataset.id = aluno._id;
			alunoElement.innerHTML = `
                <span>${aluno.registration || 'N/A'}</span>
                <span>${aluno.name || 'Nome não informado'}</span>
                <span>${aluno.subjects.length}</span>
                <span>Editar</span>
                <span class="excluir">Excluir</span>
            `;
			container.appendChild(alunoElement);
		}
	}

	if (path === '/professores-cadastrados') {
		const response = await fetch(
			`http://localhost:3030/api/all/professor`,
			{ cache: 'no-store' },
		);
		if (!response.ok)
			throw new Error(`Erro na API: ${response.statusText}`);

		const freshUsersData = await response.json();
		const professoresAtivos = freshUsersData.filter(
			user => !user.is_deleted,
		);

		const totalContainer = document.getElementById('total-cadastrados');
		totalContainer.innerHTML = `${professoresAtivos.length} cadastrados`;

		const container = document.querySelector('.cadastrados');
		container.innerHTML = '';

		for (const professor of professoresAtivos) {
			const professorElement = document.createElement('p');
			professorElement.className = 'professor-item';
			professorElement.dataset.id = professor._id;
			professorElement.innerHTML = `
                <span>${professor.registration || 'N/A'}</span>
                <span>${professor.name || 'Nome não informado'}</span>
                <span>${professor.subjects.length}</span>
                <span>Editar</span>
                <span class="excluir">Excluir</span>
            `;
			container.appendChild(professorElement);
		}
	}

	if (path === '/disciplinas-cadastradas') {
		const response = await fetch(`http://localhost:3030/api/all/subject`, {
			cache: 'no-store',
		});
		if (!response.ok)
			throw new Error(`Erro na API: ${response.statusText}`);

		const freshUsersData = await response.json();
		const totalContainer = document.getElementById('total-cadastrados');
		totalContainer.innerHTML = `${freshUsersData.length} cadastradas`;

		const container = document.querySelector('.cadastrados');
		container.innerHTML = '';

		for (const disciplina of freshUsersData) {
			const disciplinaElement = document.createElement('p');
			disciplinaElement.className = 'disciplina-item';
			disciplinaElement.dataset.id = disciplina._id;
			disciplinaElement.innerHTML = `
                <span>${disciplina.name || 'Nome não informado'}</span>
                <span>${disciplina.professor?.name || 'N/A'}</span>
                <span>0</span>
                <span>Editar</span>
                <span class="excluir">Excluir</span>
            `;
			container.appendChild(disciplinaElement);
		}
	}

	const botoesExcluir = document.querySelectorAll('.excluir');
	botoesExcluir.forEach(botao => {
		botao.onclick = async event => {
			const itemParaRemover = event.target.closest('p');
			const { id } = itemParaRemover.dataset;

			if (!id || !confirm('Tem certeza que deseja excluir este item?')) {
				return;
			}

			try {
				const response = await fetch(
					`http://localhost:3030/api/delete/${id}`,
					{ method: 'DELETE' },
				);
				if (response.ok) {
					itemParaRemover.remove();
				} else {
					const errorData = await response.json();
					alert(`Falha ao excluir: ${errorData.error}`);
				}
			} catch (error) {
				console.error('Erro na requisição de exclusão:', error);
				alert('Não foi possível conectar ao servidor.');
			}
		};
	});

	const voltarButton = document.getElementById('icone_voltar');
	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}

	const cadastrarButton = document.getElementById('cadastrar-button');
	if (cadastrarButton) {
		cadastrarButton.onclick = () => {
			let newPath = '';
			if (path === '/alunos-cadastrados') newPath = '/cadastrar-aluno';
			if (path === '/professores-cadastrados')
				newPath = '/cadastrar-professor';
			if (path === '/disciplinas-cadastradas')
				newPath = '/cadastrar-disciplina';

			if (newPath) {
				window.history.pushState({}, '', newPath);
				window.dispatchEvent(new CustomEvent('route-change'));
			}
		};
	}
}

window.addEventListener('page-rendered', loadCadastrados);
loadCadastrados();
