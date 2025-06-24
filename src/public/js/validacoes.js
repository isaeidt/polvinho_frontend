export function validarFormulario(data, schema) {
	const errors = {};
	for (const campo in schema) {
		const regras = schema[campo];
		const valor = data[campo] ?? '';

		if (regras.required && !valor.trim()) {
			errors[campo] = 'Obrigatório';
			continue;
		}
		if (regras.min && valor.length < regras.min) {
			errors[campo] = `Usuário ou senha incorretos`;
			continue;
		}

		if (regras.regex && !regras.regex.test(valor)) {
			errors[campo] = 'Usuário ou senha incorretos';
			continue;
		}
	}
	return errors;
}

export function toggleErro(inputEl, erroBox, msg) {
	const box = inputEl.parentElement;
	if (box) {
		box.classList.toggle('disable', Boolean(msg));

		let span = erroBox.querySelector('.error-msg');
		if (!span) {
			span = document.createElement('span');
			span.className = 'error-msg';
			span.style.color = 'red';
			erroBox.appendChild(span);
		}
		span.textContent = msg || '';

		if (msg) {
			inputEl.style.border = '2px solid red';
			span.textContent = msg;
			span.style.display = 'block';
		} else {
			inputEl.style.border = '';
			span.textContent = '';
			span.style.display = 'none';
		}
	}
}
