const subjectsContainer = document.querySelector('.subjects');

if (subjectsContainer) {
	const subject = document.createElement('p');
	subject.className = 'subject';
	subject.innerText = 'Almoço';
	subjectsContainer.appendChild(subject);

	subject.addEventListener('click', () => {
		const link = document.createElement('a');
		link.href = '/disciplina';
		window.route({ preventDefault: () => {}, currentTarget: link });
	});
}
