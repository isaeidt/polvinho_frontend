import { getLoggedInUser } from './auth.js';

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

	const loggedInUser = getLoggedInUser();
	if (!loggedInUser) {
		console.error(
			'Usuário não logado. Redirecionando para a página de login.',
		);
		window.history.pushState({}, '', '/login');
		window.dispatchEvent(new CustomEvent('route-change'));
		return;
	}
	const userRole = loggedInUser.role;

	if (userRole === 'Professor') {
		const column = document.querySelector('.column_quizzes');
		column.innerHTML = `<h2 class ='postados'>Postados</h2><h2 class ='arquivados'>Arquivados</h2>`;
		const subjectId = JSON.parse(localStorage.getItem('subjectId'));
		console.log('🚀 ~ loadSubject ~ subjectId:', subjectId);

		const response = await fetch(
			`https://polvinho-api-lj8e.onrender.com/api/quizzes/all/quiz`,
			{
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshQuizData = await response.json();
		console.log('🚀 ~ loadSubject ~ freshQuizData:', freshQuizData);
		const filteredQuizzes = freshQuizData.filter(
			quizData => quizData.subject._id === subjectId.id,
		);
		console.log('🚀 ~ loadSubject ~ filteredQuizzes:', filteredQuizzes);
		for (const quizData of filteredQuizzes) {
			const quizList = document.createElement('ul');
			const quizElement = document.createElement('li');
			quizElement.className = 'quiz';
			quizElement.innerText = quizData.title;
			quizElement.dataset.quizId = quizData._id;

			quizList.appendChild(quizElement);
			if (quizData.is_published) {
				const postados = document.querySelector('.postados');
				postados.appendChild(quizList);
			} else {
				const arquivados = document.querySelector('.arquivados');
				arquivados.appendChild(quizList);
			}
		}
	} else {
		const button = document.querySelector('#cadastrar-button');
		button.remove();
		const subjectId = JSON.parse(localStorage.getItem('subjectId'));
		console.log('🚀 ~ loadSubject ~ subjectId:', subjectId);

		const response = await fetch(
			`https://polvinho-api-lj8e.onrender.com/api/quizzes/all/quiz`,
			{
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			throw new Error(`Erro na API: ${response.statusText}`);
		}
		const freshQuizData = await response.json();
		console.log('🚀 ~ loadSubject ~ freshQuizData:', freshQuizData);
		const filteredQuizzes = freshQuizData.filter(
			quizData => quizData.subject._id === subjectId.id,
		);
		console.log('🚀 ~ loadSubject ~ filteredQuizzes:', filteredQuizzes);
		for (const quizData of filteredQuizzes) {
			const quizElement = document.createElement('p');
			quizElement.className = 'quiz';
			const data = new Date(quizData.release_date);
			const dataFormatada = data.toLocaleDateString('pt-BR', {
				timeZone: 'UTC',
			});
			quizElement.innerHTML = `<span>${quizData.title}</span>
            <span>${dataFormatada}</span>
			<span>Simulado</span>`;

			quizElement.dataset.quizId = quizData._id;

			if (quizData.is_published) {
				const quizzes = document.querySelector('.quizzes');
				quizzes.appendChild(quizElement);
			}
		}
	}

	const subjectData = localStorage.getItem('subjectId');
	const subject = subjectData ? JSON.parse(subjectData) : null;

	if (titulo && subject && subject.name) {
		titulo.innerHTML = subject.name;
	} else {
		titulo.innerHTML = 'Matéria não encontrada';
	}

	const cadastrarButton = document.getElementById('cadastrar-button');
	if (cadastrarButton) {
		cadastrarButton.onclick = () => {
			const newPath = '/criar-quiz';

			if (newPath) {
				window.history.pushState({}, '', newPath);
				window.dispatchEvent(new CustomEvent('route-change'));
			}
		};
	}
}

window.addEventListener('page-rendered', loadSubject);

loadSubject();
