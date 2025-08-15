document.addEventListener('DOMContentLoaded', function () {
	const sidebarContainer = document.getElementById('sidebar');

	if (sidebarContainer) {
		fetch('../components/html/sidebar.html')
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(html => {
				sidebarContainer.innerHTML = html;

				const dashboard = document.getElementById('button_dashboard');
				const sair = document.getElementById('button_sign_out');
				const subjects = document.getElementById('button_subjects');

				if (sair) {
					sair.addEventListener('click', event => {
						event.preventDefault();
						localStorage.clear(); // ver se isso ta funcionando mesmo pq acho que nn ta não
						window.location.assign('/login'); 
					});
				}

				if (dashboard) {
					dashboard.addEventListener('click', () => {
						const user = JSON.stringify(localStorage.getItem('userLogin'))
						const userRole = user.role
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
						window.dispatchEvent(new CustomEvent('route-change'));
					
						
					});
				}

				if(subjects){ // tem que ver e ajustar o css dessa parte pq nn faço a menor ideia de como ficou!
					//nn está como deve ser pq tem que appen esse código no button pra descer
					subjects.addEventListener('click', () => { 
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
						}else{
							/*
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
							});		*/// AQUI TEM QUE ARRUMAR PRA FAZER SÓ 	UMA LISTA						
						}
					});
				}
			})
			.catch(error => {
				console.error('Erro ao carregar a sidebar:', error);
				sidebarContainer.innerHTML = `<p>Erro ao carregar a sidebar. Verifique o caminho no console (F12).</p>`;
			});
	}
});
// fazer pra mudar a parte das disciplinas quando for professor ou admin
