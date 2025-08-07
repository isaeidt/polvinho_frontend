const appContainer = document.getElementById('app-container');

const routes = {
	'/': { file: '/public/html/login.html', class: 'login-page-wrapper' },
	'/login': { file: '/public/html/login.html', class: 'login-page-wrapper' },
	'/recuperar-senha': {
		file: '/public/html/recuperarSenha.html',
		class: 'recuperar-senha-wrapper',
	},

	'/dashboard-admin': {
		file: '/public/html/dashboardAdmin.html',
		class: 'dashboard-wrapper',
		allowedRoles: ['Admin'],
	},
	'/dashboard-professor': {
		file: '/public/html/dashboardProfessor.html',
		class: 'dashboard-wrapper',
		allowedRoles: ['Professor'],
	},
	'/dashboard-aluno': {
		file: '/public/html/dashboardAluno.html',
		class: 'dashboard-wrapper',
		allowedRoles: ['Aluno'],
	},
	'/disciplina': {
		file: '/public/html/subject.html',
		class: 'subject-wrapper',
		allowedRoles: ['Admin', 'Professor', 'Aluno'],
	},
	'/trocar-senha': {
		file: '/public/html/trocarSenha.html',
		class: 'trocar-senha-wrapper',
		allowedRoles: ['Admin', 'Professor', 'Aluno'],
	},
	'/alunos-cadastrados': {
		file: '/public/html/alunosCadastrados.html',
		class: 'subject-wrapper',
		allowedRoles: ['Admin'],
	},
	'/professores-cadastrados': {
		file: '/public/html/professoresCadastrados.html',
		class: 'subject-wrapper',
		allowedRoles: ['Admin'],
	},
	'/disciplinas-cadastradas': {
		file: '/public/html/disciplinasCadastradas.html',
		class: 'subject-wrapper',
		allowedRoles: ['Admin'],
	},
	'/cadastrar': {
		file: '/public/html/cadastrar.html',
		class: 'subject-wrapper',
		allowedRoles: ['Admin'],
	},
}; // rotas onde mostra o nome da rota definindo, o caminho no repositório, a class pra poder carregar o css certo e a role que é permetida pra essa rota

const privateRoutes = [
	'/dashboard-admin',
	'/dashboard-professor',
	'/dashboard-aluno',
	'/disciplina',
	'/alunos-cadastrados',
	'/professores-cadastrados',
	'/disciplinas-cadastradas',
	'/cadastrar',
];

const isAuthenticated = () => {
	const userLogin = localStorage.getItem('userLogin');
	if (!userLogin) return false;
	try {
		const { token } = JSON.parse(userLogin);
		return !!token;
	} catch {
		return false;
	}
}; // verifica se o usuário tem o token válido para estar naquela rota

const executeScripts = container => {
	const scripts = container.querySelectorAll('script');
	scripts.forEach(script => {
		const newScript = document.createElement('script');
		script
			.getAttributeNames()
			.forEach(attr =>
				newScript.setAttribute(attr, script.getAttribute(attr)),
			);
		newScript.textContent = script.textContent;
		document.body.appendChild(newScript).remove();
	});
}; //isso aqui executa os scripts das páginas, já que eu estou usando páginas html tem que colocar isso para carregar o html e o script

const loadPage = async route => {
	try {
		appContainer.className = '';
		appContainer.classList.add(route.class);

		if (privateRoutes.includes(window.location.pathname)) {
			const layoutResponse = await fetch(
				'/public/components/html/sidebar.html',
			);
			const layoutHtml = await layoutResponse.text();
			appContainer.innerHTML = layoutHtml;

			const pageResponse = await fetch(route.file);
			const pageHtml = await pageResponse.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(pageHtml, 'text/html');

			const contentWrapper = appContainer.querySelector(
				'#page-content-wrapper',
			);
			if (contentWrapper) {
				contentWrapper.innerHTML = doc.body.innerHTML;
				executeScripts(contentWrapper);
			}
		} else {
			const response = await fetch(route.file);
			if (!response.ok)
				throw new Error(`Página ${route.file} não encontrada`);

			const pageHtml = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(pageHtml, 'text/html');
			const pageContent = doc.body;

			if (pageContent) {
				appContainer.innerHTML = pageContent.innerHTML;
			}
			executeScripts(appContainer);
		}

		window.dispatchEvent(
			new CustomEvent('page-rendered', {
				detail: { path: window.location.pathname },
			}),
		);
	} catch (error) {
		console.error('Erro ao carregar a página:', error);
		appContainer.innerHTML = '<h1>Erro 404: Página não encontrada</h1>';
	}
}; //coloca o css certo nas páginas, se a rota for privada carrega o side bar e o resto dentro de uma div que está na sidebar

const handleLocation = async () => {
	const path = window.location.pathname;
	const route = routes[path];

	if (!route) {
		window.history.replaceState({}, '', '/login');
		await loadPage(routes['/login']);
		return;
	}

	const routeIsPrivate = route.allowedRoles && route.allowedRoles.length > 0;
	const userIsAuthenticated = isAuthenticated();

	if (routeIsPrivate && !userIsAuthenticated) {
		window.history.replaceState({}, '', '/login');
		await loadPage(routes['/login']);
		return;
	}
	if (routeIsPrivate && userIsAuthenticated) {
		const userRole = getUserRole();

		if (!route.allowedRoles.includes(userRole)) {
			alert(
				'Acesso negado. Você não tem permissão para aceder a esta página.',
			);

			const roleToDashboard = {
				Admin: '/dashboard-admin',
				Professor: '/dashboard-professor',
				Aluno: '/dashboard-aluno',
			};
			const userDashboard = roleToDashboard[userRole] || '/login';

			window.history.replaceState({}, '', userDashboard);
			await handleLocation();
			return;
		}
	}

	await loadPage(route);
}; /*procura a rota atual se nn tiver vai pro login, se for privada e nn autenticado pro login e se a role nn for a permitida emite um alerta que nn pode e 
manda pra rota certa */

const getUserRole = () => {
	const userLogin = localStorage.getItem('userLogin');
	if (!userLogin) return null;
	try {
		const { user } = JSON.parse(userLogin);
		return user ? user.role : null;
	} catch {
		return null;
	}
}; //pega a role no localstorage, e depois essa dunção eu chamo no handle pra poder validar se pode entrar na rota

window.route = event => {
	event.preventDefault();
	const targetUrl = new URL(event.currentTarget.href);
	window.history.pushState({}, '', targetUrl.pathname);
	handleLocation();
}; //muda a url e chama o roteador sem que precise carregar a página

window.onpopstate = handleLocation; //se usar a seta do navegador chama a função handle
window.addEventListener('route-change', handleLocation); //sempre que chamar o route change tipo no login ele vai chamar a handlelocation pra atualizar a página

document.addEventListener('DOMContentLoaded', handleLocation); //quando o html termina de carregar ele chama o handle
