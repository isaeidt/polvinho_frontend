import { getLoggedInUser } from '../../js/auth.js';

function setupSidebar() {
	const dashboardButton = document.getElementById('button_dashboard');
	const signOutButton = document.getElementById('button_sign_out');
	const subjectsContainer = document.getElementById('subjects');
	const subjectsButton = document.getElementById('button_subjects');

	if (!subjectsContainer) return;

	const loggedInUser = getLoggedInUser();
	if (!loggedInUser) return;

	const { role: userRole, id: userId } = loggedInUser;

	if (userRole === 'Admin') {
		subjectsButton.innerHTML = 'Painel';
	}

	if (dashboardButton) {
		dashboardButton.onclick = e => {
			e.preventDefault();
			let path = '/login';
			if (userRole === 'Admin') path = '/dashboard-admin';
			if (userRole === 'Professor') path = '/dashboard-professor';
			if (userRole === 'Aluno') path = '/dashboard-aluno';
			window.history.pushState({}, '', path);
			window.dispatchEvent(new CustomEvent('route-change'));
		};
	}

	if (signOutButton) {
		signOutButton.onclick = e => {
			e.preventDefault();
			localStorage.clear();
			window.location.assign('/login');
		};
	}

	if (subjectsButton) {
		let subjectsList = document.querySelector('.subjects-list');
		if (!subjectsList) {
			subjectsList = document.createElement('div');
			subjectsList.className = 'subjects-list';
			subjectsContainer.after(subjectsList);
		}

		subjectsButton.onclick = async e => {
			e.preventDefault();
			const isVisible = subjectsList.style.display === 'flex';
			subjectsList.style.display = isVisible ? 'none' : 'flex';

			if (!isVisible && subjectsList.childElementCount === 0) {
				if (userRole === 'Admin') {
					const adminLinks = [
						{ name: 'Alunos', path: '/alunos-cadastrados' },
						{
							name: 'Professores',
							path: '/professores-cadastrados',
						},
						{
							name: 'Disciplinas',
							path: '/disciplinas-cadastradas',
						},
					];
					adminLinks.forEach(info => {
						const link = document.createElement('a');
						link.textContent = info.name;
						link.href = info.path;
						link.onclick = ev => {
							ev.preventDefault();
							window.history.pushState({}, '', info.path);
							window.dispatchEvent(
								new CustomEvent('route-change'),
							);
						};
						subjectsList.appendChild(link);
					});
				} else {
					const response = await fetch(
						`http://localhost:3030/api/${userId}`,
					);
					const userData = await response.json();
					if (userData.subjects && userData.subjects.length > 0) {
						userData.subjects.forEach(subject => {
							const link = document.createElement('a');
							link.textContent = subject.name;
							link.href = '/disciplina';
							link.onclick = ev => {
								ev.preventDefault();
								localStorage.setItem(
									'subjectId',
									JSON.stringify({
										id: subject._id,
										name: subject.name,
									}),
								);
								window.history.pushState({}, '', '/disciplina');
								window.dispatchEvent(
									new CustomEvent('route-change'),
								);
							};
							subjectsList.appendChild(link);
						});
					} else {
						subjectsList.innerHTML = '<p>Nenhuma disciplina.</p>';
					}
				}
			}
		};
	}
}

window.addEventListener('page-rendered', setupSidebar);
setupSidebar();
