async function loadCadastrar() {
	const isCadastrarPage = window.location.pathname.startsWith('/cadastrar-');
	const path = window.location.pathname;
	if (!isCadastrarPage) {
		return;
	}

	const voltarButton = document.getElementById('icone_voltar');
	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}

	if (path !== '/cadastrar-disciplina') {
		const originalSelect = document.getElementById('disciplinas_input');
		if (!originalSelect) return;

		const container = document.createElement('div');
		container.className = 'custom-select-container';

		const tagsContainer = document.createElement('div');
		tagsContainer.className = 'selected-tags';
		tagsContainer.textContent = 'Selecione...';

		const optionsList = document.createElement('div');
		optionsList.className = 'options-list';
		optionsList.style.display = 'none';

		container.appendChild(tagsContainer);
		container.appendChild(optionsList);
		originalSelect.parentElement.replaceChild(container, originalSelect);

		try {
			const response = await fetch(
				`http://localhost:3030/api/all/subject`,
			);
			if (!response.ok) throw new Error('Falha ao buscar dados');

			const subjects = await response.json();

			subjects.forEach(subject => {
				const optionItem = document.createElement('div');
				optionItem.className = 'option-item';
				optionItem.textContent = subject.name;
				optionItem.dataset.id = subject._id;
				optionsList.appendChild(optionItem);

				optionItem.onclick = () => {
					if (tagsContainer.textContent === 'Selecione...') {
						tagsContainer.textContent = '';
					}

					const tag = document.createElement('span');
					tag.className = 'tag-item';
					tag.textContent = subject.name;
					tag.dataset.id = subject._id;

					const removeBtn = document.createElement('b');
					removeBtn.textContent = 'x';
					removeBtn.onclick = () => {
						tag.remove();
						if (tagsContainer.childElementCount === 0) {
							tagsContainer.textContent = 'Selecione...';
						}
					};

					tag.appendChild(removeBtn);
					tagsContainer.appendChild(tag);
				};
			});
		} catch (error) {
			console.error('Erro ao carregar disciplinas:', error);
		}

		tagsContainer.addEventListener('click', () => {
			optionsList.style.display =
				optionsList.style.display === 'none' ? 'block' : 'none';
		});

		const formCadastro = document.querySelector('.cadastrar-form');
		if (formCadastro) {
			formCadastro.addEventListener('submit', async event => {
				event.preventDefault();

				const name = formCadastro.querySelector('#nome_input');
				const registration =
					formCadastro.querySelector('#matricula_input');
				const email = formCadastro.querySelector('#email_input');
				const disciplinaTags =
					formCadastro.querySelectorAll('.tag-item');
				const subjectIds = Array.from(disciplinaTags).map(
					tag => tag.dataset.id,
				);

				/*fazer validacoes dos dados pra fazer toggleErro*/

				const data = {
					name: name.value.trim(),
					registration: registration.value.trim(),
					email: email.value.trim(),
					subjects: subjectIds,
				};

				await cadastrar(
					data.email,
					data.name,
					data.registration,
					data.subjects,
				);
				window.history.back();
			});
		}
	} else {
		const form = document.querySelector('.cadastrar-form');
		const nome = document.querySelector('.nome');
		nome.innerHTML = `<label for="nome_input">Nome</label>
                    <input id="nome_input" type="text" placeholder="Nome " autocomplete="off">`;
		const matricula = document.querySelector('.matricula');
		matricula.remove();
		const email = document.querySelector('.email');
		email.remove();
		const disciplinas = document.querySelector('.disciplinas');
		disciplinas.remove();
		const professor = document.createElement('div');
		professor.className = 'professor';
		professor.innerHTML = `<label for="professor_input">Professor</label>
        <select id="professor_input" name="professor" multiple></select>`;
		form.appendChild(professor);
		const originalSelect = document.getElementById('professor_input');
		if (!originalSelect) return;

		const container = document.createElement('div');
		container.className = 'custom-select-container';

		const tagsContainer = document.createElement('div');
		tagsContainer.className = 'selected-tags';
		tagsContainer.textContent = 'Selecione...';

		const optionsList = document.createElement('div');
		optionsList.className = 'options-list';
		optionsList.style.display = 'none';

		container.appendChild(tagsContainer);
		container.appendChild(optionsList);
		originalSelect.parentElement.replaceChild(container, originalSelect);

		try {
			const response = await fetch(
				`http://localhost:3030/api/all/professor`,
			);
			if (!response.ok) throw new Error('Falha ao buscar dados');

			const subjects = await response.json();

			subjects.forEach(professor => {
				const optionItem = document.createElement('div');
				optionItem.className = 'option-item';
				optionItem.textContent = professor.name;
				optionItem.dataset.id = professor._id;
				optionsList.appendChild(optionItem);

				optionItem.onclick = () => {
					tagsContainer.textContent = professor.name;

					tagsContainer.dataset.selectedId = professor._id;

					optionsList.style.display = 'none';
				};
			});
		} catch (error) {
			console.error('Erro ao carregar disciplinas:', error);
		}

		tagsContainer.addEventListener('click', () => {
			optionsList.style.display =
				optionsList.style.display === 'none' ? 'block' : 'none';
		});

		const formCadastro = document.querySelector('.cadastrar-form');
		if (formCadastro) {
			formCadastro.addEventListener('submit', async event => {
				event.preventDefault();

				const name = formCadastro.querySelector('#nome_input');
				const selectedContainer =
					formCadastro.querySelector('.selected-tags');
				const professorId = selectedContainer.dataset.selectedId;

				if (!professorId) {
					console.error('Nenhum professor selecionado!');
					return;
				}
				const data = {
					name: name.value.trim(),
					professor: professorId,
				};

				await cadastrarDisciplina(data.name, data.professor);
				window.history.back();
			});
		}
	}

	const cadastrarDisciplina = async (name, professor) => {
		try {
			const disciplinaData = {
				name: name,
				professor: professor,
			};
			const response = await fetch(
				'http://localhost:3030/api/create/subject',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(disciplinaData),
				},
			);
			const result = await response.json();
			return response.ok ? result : null;
		} catch (error) {
			console.error('Request failed:', error);
			return null;
		}
	};

	const cadastrar = async (email, name, registration, subjects) => {
		try {
			const cadastroData = {
				email: email,
				name: name,
				registration: registration,
				subjects: subjects,
			};
			const path = window.location.pathname;
			if (path === '/cadastrar-aluno') {
				const response = await fetch(
					'http://localhost:3030/api/create/aluno',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(cadastroData),
					},
				);
				const result = await response.json();
				return response.ok ? result : null;
			}
			if (path === '/cadastrar-professor') {
				const response = await fetch(
					'http://localhost:3030/api/create/professor',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(cadastroData),
					},
				);
				const result = await response.json();
				return response.ok ? result : null;
			}
			if (path === '/cadastrar-disciplina') {
				const response = await fetch(
					'http://localhost:3030/api/create/subject',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(cadastroData), //fazer o cadastroData da subject pq é diferente
					},
				);
				const result = await response.json();
				return response.ok ? result : null;
			}
		} catch (error) {
			console.error('Request failed:', error);
			return null;
		}
	};
}

window.addEventListener('page-rendered', loadCadastrar);
loadCadastrar();
