import { toggleErro, validarFormulario } from '../js/validacoes.js';

const form = document.querySelector('form');
const user = document.querySelector('#user');
const senha = document.querySelector('#senha');
const erroUser = document.querySelector('.erro_user');
const erroSenha = document.querySelector('.erro_senha');

const STORAGE_KEY = 'userLogin';

const userSchema = {
	user: { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
	senha: { required: true, min: 8 },
};

form.addEventListener('submit', async event => {
	event.preventDefault();
	const data = {
		user: user.value.trim(),
		senha: senha.value.trim(),
	};
	const errors = validarFormulario(data, userSchema);
	exibirErrosNaTela(errors);
	if (Object.keys(errors).length) return;
	saveForm(data);
	login(data.user, data.senha);
	const sucesso = await login(data.user, data.senha);
	if (sucesso) {
		window.location.assign(
			'http://127.0.0.1:5501/src/public/html/dashboard.html',
		);
	}

	user.value = '';
	senha.value = '';
});

const login = async (user, password) => {
	try {
		const loginData = {
			email: user,
			password_hash: password,
		};
		const response = await fetch('http://localhost:3000/login', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
			credentials: 'same-origin',
		});
		const result = await response.json();
		console.log(result);

		if (response.ok && result.user && result.token) {
			return true;
		} else {
			console.log('usuario não cadastrado');
			return false;
		}
	} catch (error) {
		console.log('request failed', error);
		return false;
	}
};

function loadForm() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch {
		return {};
	}
}

function saveForm(patch) {
	const current = loadForm();
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
}

function exibirErrosNaTela(errors) {
	if (!errors.user) toggleErro(user, erroUser, '');
	else toggleErro(user, erroUser, errors.user);

	if (!errors.senha) toggleErro(senha, erroSenha, '');
	else toggleErro(senha, erroSenha, errors.senha);
}
