import { BACK_URL } from './config.js';
async function loadCriar() {
	if (window.location.pathname !== '/criar-quiz') {
		return;
	}
	const voltarButton = document.getElementById('icone_voltar');
	if (voltarButton) {
		voltarButton.onclick = () => {
			window.history.back();
		};
	}
	const originalSelect = document.getElementById('disciplinas_input');

	if (!originalSelect) return;

	const container = document.createElement('div');
	container.className = 'custom-select-container';

	const tagsContainer = document.createElement('div');
	tagsContainer.className = 'selected-tags';
	tagsContainer.textContent = 'Selecione a disciplina';

	const optionsList = document.createElement('div');
	optionsList.className = 'options-list';
	optionsList.style.display = 'none';

	container.appendChild(tagsContainer);
	container.appendChild(optionsList);
	originalSelect.parentElement.replaceChild(container, originalSelect);

	try {
		const response = await fetch(`${BACK_URL}/api/all/subject`);
		if (!response.ok) throw new Error('Falha ao buscar dados');

		const subjects = await response.json();
		const professor = JSON.parse(localStorage.getItem('userLogin'));

		const professorId = professor.user.id;
		const filteredSubjects = subjects.filter(
			subjectsData => subjectsData.professor === professorId,
		);
		console.log('🚀 ~ loadCriar ~ filteredSubjects:', filteredSubjects);

		console.log('🚀 ~ loadCriar ~ subjects:', subjects);

		filteredSubjects.forEach(subject => {
			const optionItem = document.createElement('div');
			optionItem.className = 'option-item';
			optionItem.textContent = subject.name;
			optionItem.dataset.id = subject._id;
			optionsList.appendChild(optionItem);

			optionItem.onclick = () => {
				tagsContainer.textContent = subject.name;

				tagsContainer.dataset.selectedId = subject._id;

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
			const tempo = formCadastro.querySelector('#tempo_input');
			const tentativas = formCadastro.querySelector('#tentativas_input');
			const dataInicio = formCadastro.querySelector('#dataInicio_input');
			const selectedContainer =
				formCadastro.querySelector('.selected-tags');
			const subjectId = selectedContainer.dataset.selectedId;

			/*fazer validacoes dos dados pra fazer toggleErro*/

			const data = {
				title: name.value.trim(),
				max_attempts: tentativas.value.trim(),
				time_minutes: tempo.value.trim(),
				release_date: dataInicio.value.trim(),
				subject: subjectId,
			};

			await criarQuiz(
				data.title,
				data.max_attempts,
				data.time_minutes,
				data.release_date,
				data.subject,
			);
			window.history.back();
		});
	}
	const criarQuiz = async (
		title,
		max_attempts,
		time_minutes,
		release_date,
		subject,
	) => {
		try {
			const disciplinaData = {
				title: title,
				max_attempts: max_attempts,
				time_minutes: time_minutes,
				release_date: release_date,
				subject: subject,
			};
			const response = await fetch(
				`${BACK_URL}/api/quizzes/create/quiz`,
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
}

window.addEventListener('page-rendered', loadCriar);
loadCriar();
