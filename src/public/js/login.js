import { toggleErro, validarFormulario } from '../js/validacoes.js';

const formLogin = document.querySelector('.login-page-wrapper form');

if (formLogin) {
	formLogin.addEventListener('submit', async event => {
		event.preventDefault();

		const user = formLogin.querySelector('#user');
		const senha = formLogin.querySelector('#senha');
		const erroUser = formLogin.querySelector('.erro_user');
		const erroSenha = formLogin.querySelector('.erro_senha');

		const userSchema = {
			user: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
			senha: { required: true },
		};

		const data = {
			user: user.value.trim(),
			senha: senha.value.trim(),
		};

		const errors = validarFormulario(data, userSchema);

		exibirErrosNaTela(errors, user, erroUser, senha, erroSenha);

		if (Object.keys(errors).length > 0) return;

		const loginResult = await login(data.user, data.senha);

		if (loginResult && loginResult.token && loginResult.user) {
			localStorage.setItem('userLogin', JSON.stringify(loginResult));
			const userRole = loginResult.user.role;
			let path = '/login';
			switch (userRole) {
				case 'Admin':
					path = '/dashboard-admin';
					break;
				case 'Professor':
					path = '/dashboard-professor';
					break;
				case 'Aluno':
					path = '/dashboard-aluno';
					break;
			}
			window.history.pushState({}, '', path);
			window.dispatchEvent(new CustomEvent('route-change')); // faz um evento route-change que cai lá no router e chama a função handlelocation
		} else {
			if (erroSenha) {
				toggleErro(senha, erroSenha, 'Usuário ou senha inválidos.');
			}
		}
	});
}

const login = async (email, password) => {
	try {
		const loginData = { email: email, password_hash: password };
		const response = await fetch(
			'https://polvinho-api-lj8e.onrender.com/login',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(loginData),
			},
		);
		const result = await response.json();
		return response.ok ? result : null;
	} catch (error) {
		console.error('Request failed:', error);
		return null;
	}
};

function exibirErrosNaTela(errors, user, erroUser, senha, erroSenha) {
	if (erroUser && erroSenha) {
		toggleErro(user, erroUser, errors.user || '');
		toggleErro(senha, erroSenha, errors.senha || '');
	}
}
