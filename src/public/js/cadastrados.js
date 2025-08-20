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
		const response = await fetch(
			`https://polvinho-api-lj8e.onrender.com/api/all/aluno`,
			{
				cache: 'no-store',
			},
		);
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

			const containerSubject = document.createElement('div');
			containerSubject.className = 'container-subjectname';

			for (const subject of aluno.subjects) {
				const subjectElement = document.createElement('p');
				subjectElement.className = 'subject-item';
				subjectElement.innerText = `${subject.name}`;
				containerSubject.appendChild(subjectElement);
			}

			const subjectLenSpan = document.createElement('span');
			subjectLenSpan.className = 'subjectLen';
			subjectLenSpan.textContent = aluno.subjects.length;

			subjectLenSpan.appendChild(containerSubject);

			subjectLenSpan.addEventListener('mouseover', () => {
				if (aluno.subjects.length > 0) {
					containerSubject.classList.add('on');
				}
			});
			subjectLenSpan.addEventListener('mouseout', () => {
				containerSubject.classList.remove('on');
			});

			alunoElement.innerHTML = `
            <span>${aluno.registration || 'N/A'}</span>
            <span>${aluno.name || 'Nome não informado'}</span>
            <span class="editar">Editar</span>
            <span class="excluir">Excluir</span>
        `;

			alunoElement.insertBefore(
				subjectLenSpan,
				alunoElement.querySelector('.aluno-item > span:nth-of-type(3)'),
			);

			container.appendChild(alunoElement);
		}
	}

	if (path === '/professores-cadastrados') {
		const response = await fetch(
			`https://polvinho-api-lj8e.onrender.com/api/all/professor`,
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

			const containerSubject = document.createElement('div');
			containerSubject.className = 'container-subjectname';

			for (const subject of professor.subjects) {
				const subjectElement = document.createElement('p');
				subjectElement.className = 'subject-item';
				subjectElement.innerText = `${subject.name}`;
				containerSubject.appendChild(subjectElement);
			}

			const subjectLenSpan = document.createElement('span');
			subjectLenSpan.className = 'subjectLen';
			subjectLenSpan.textContent = professor.subjects.length;

			subjectLenSpan.appendChild(containerSubject);

			subjectLenSpan.addEventListener('mouseover', () => {
				if (professor.subjects.length > 0) {
					containerSubject.classList.add('on');
				}
			});
			subjectLenSpan.addEventListener('mouseout', () => {
				containerSubject.classList.remove('on');
			});

			professorElement.innerHTML = `
                <span>${professor.registration || 'N/A'}</span>
                <span>${professor.name || 'Nome não informado'}</span>
                <span class="editar">Editar</span>
                <span class="excluir">Excluir</span>
            `;

			professorElement.insertBefore(
				subjectLenSpan,
				professorElement.querySelector(
					'.professor-item > span:nth-of-type(3)',
				),
			);

			container.appendChild(professorElement);
		}
	}
	if (path === '/disciplinas-cadastradas') {
		const response = await fetch(
			`https://polvinho-api-lj8e.onrender.com/api/all/subject`,
			{
				cache: 'no-store',
			},
		);
		if (!response.ok)
			throw new Error(`Erro na API: ${response.statusText}`);

		const freshUsersData = await response.json();
		console.log('🚀 ~ loadCadastrados ~ freshUsersData:', freshUsersData);
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
                <span>${disciplina.professor ? disciplina.professor.name : 'N/A'}</span>
                <span>0</span>
                <span class="editar">Editar</span>
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
					`https://polvinho-api-lj8e.onrender.com/api/delete/${id}`,
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

	const botoesEditar = document.querySelectorAll('.editar');
	botoesEditar.forEach(botao => {
		botao.addEventListener('click', event => {
			const itemParaEditar = event.target.closest('p');
			const id = itemParaEditar.dataset.id;

			if (id) {
				localStorage.setItem('editId', id);

				let newPath = '';
				const path = window.location.pathname;
				if (path === '/alunos-cadastrados') {
					newPath = '/editar-aluno';
				} else if (path === '/professores-cadastrados') {
					newPath = '/editar-professor';
				} else if (path === '/disciplinas-cadastradas') {
					newPath = '/editar-disciplina';
				}

				if (newPath) {
					window.history.pushState({}, '', newPath);
					window.dispatchEvent(new CustomEvent('route-change'));
				}
			}
		});
	});

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
