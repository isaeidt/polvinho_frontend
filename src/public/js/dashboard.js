const subjects = document.querySelector('.subjects');

document.addEventListener('DOMContentLoaded', () => {
	const subject = document.createElement('p');
	subject.className = 'subject';
	subject.innerText = 'Almoço';
	subjects.appendChild(subject);

	subject.addEventListener('click', () => {
		window.location.assign(
			'http://127.0.0.1:5501/src/public/html/subject.html',
		);
	});
});
