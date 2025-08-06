import { getLoggedInUser } from './auth.js';

async function loadDashboard() {
	const subjectsContainer = document.querySelector('.subjects');
	const loggedInUser = getLoggedInUser();

	console.log('Conteúdo de loggedInUser:', loggedInUser);

	if (!subjectsContainer || !loggedInUser) {
		console.error('Container nn encontrado');
		let path = '/login';
		window.history.pushState({}, '', path);
		window.dispatchEvent(new CustomEvent('route-change'));
		return;
	}

	const userId = loggedInUser.id;
	console.log('🚀 ~ loadDashboard ~ userId:', userId);

	try {
		const response = await fetch(`http://localhost:3030/api/${userId}`);

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshUserData = await response.json();

		console.log('freshUserData:', freshUserData);

		subjectsContainer.innerHTML = '';

		if (freshUserData.subjects && freshUserData.subjects.length > 0) {
			for (const subjectData of freshUserData.subjects) {
				const subjectElement = document.createElement('p');
				subjectElement.className = 'subject';
				subjectElement.innerText = subjectData.name;
				subjectElement.dataset.subjectId = subjectData._id;

				// subjectElement.addEventListener('click', () => {
				// 	const path = `/disciplina/${subjectData._id}`;
				// 	window.history.pushState({}, '', path);
				// 	window.dispatchEvent(new CustomEvent('route-change'));
				// });

				subjectsContainer.appendChild(subjectElement);
			}
		} else {
			subjectsContainer.innerHTML =
				'<p>Você não está matriculado em nenhuma matéria.</p>';
		}
	} catch (error) {
		console.error('Falha ao carregar dados do dashboard:', error);
		subjectsContainer.innerHTML =
			'<p>Erro ao carregar suas matérias. Tente novamente mais tarde.</p>';
	}
}

loadDashboard();
