import { getLoggedInUser } from './auth.js';
import { BACK_URL } from './config.js';
async function loadDashboard() {
	const subjectsContainer = document.querySelector('.subjects');
	const isDashboardPage = window.location.pathname.startsWith('/dashboard-');

	if (!isDashboardPage || !subjectsContainer) {
		return;
	}
	const loggedInUser = getLoggedInUser();
	if (!loggedInUser) {
		console.error(
			'Usuário não logado. Redirecionando para a página de login.',
		);
		window.history.pushState({}, '', '/login');
		window.dispatchEvent(new CustomEvent('route-change'));
		return;
	}

	const userId = loggedInUser.id;
	const userRole = loggedInUser.role;

	try {
		const response = await fetch(`${BACK_URL}/api/${userId}`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshUserData = await response.json();
		console.log('🚀 ~ loadDashboard ~ freshUserData:', freshUserData);

		if (userRole !== 'Admin') {
			subjectsContainer.innerHTML = '';
			if (freshUserData.subjects && freshUserData.subjects.length > 0) {
				for (const subjectData of freshUserData.subjects) {
					const subjectElement = document.createElement('p');
					subjectElement.className = 'subject';
					subjectElement.innerText = subjectData.name;
					subjectElement.dataset.subjectId = subjectData._id;

					subjectElement.addEventListener('click', () => {
						const subject = {
							id: subjectData._id,
							name: subjectData.name,
						};
						localStorage.setItem(
							'subjectId',
							JSON.stringify(subject),
						);
						const path = '/disciplina';
						window.history.pushState({}, '', path);
						window.dispatchEvent(new CustomEvent('route-change'));
					});

					subjectsContainer.appendChild(subjectElement);
				}
			} else {
				subjectsContainer.innerHTML =
					'<p>Você não está matriculado em nenhuma matéria.</p>';
			}
		} else {
			const alunosCadastrados = document.getElementById('alunos');
			const professoresCadastrados =
				document.getElementById('professores');
			const disciplinasCadastradas =
				document.getElementById('disciplinas');
			alunosCadastrados.addEventListener('click', () => {
				const path = '/alunos-cadastrados';
				window.history.pushState({}, '', path);
				window.dispatchEvent(new CustomEvent('route-change'));
			});
			professoresCadastrados.addEventListener('click', () => {
				const path = '/professores-cadastrados';
				window.history.pushState({}, '', path);
				window.dispatchEvent(new CustomEvent('route-change'));
			});
			disciplinasCadastradas.addEventListener('click', () => {
				const path = '/disciplinas-cadastradas';
				window.history.pushState({}, '', path);
				window.dispatchEvent(new CustomEvent('route-change'));
			});
		}
	} catch (error) {
		console.error('Falha ao carregar dados do dashboard:', error);
		subjectsContainer.innerHTML =
			'<p>Erro ao carregar suas matérias. Tente novamente mais tarde.</p>';
	}
}

window.addEventListener('page-rendered', loadDashboard);

loadDashboard();
