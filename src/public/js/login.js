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

form.addEventListener('submit', event => {
	event.preventDefault();
	const data = {
		user: user.value.trim(),
		senha: senha.value.trim(),
	};
	const errors = validarFormulario(data, userSchema);
	exibirErrosNaTela(errors);
	if (Object.keys(errors).length) return;
	saveForm(data);
	user.value = '';
	senha.value = '';
});

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
	if (errors.user === errors.senha) {
		toggleErro(user, erroUser, errors.user);
		toggleErro(senha, erroUser, errors.senha);
	} else {
		toggleErro(user, erroUser, errors.user);
		toggleErro(senha, erroSenha, errors.senha);
	}
}
