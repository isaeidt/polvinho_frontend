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

				if (sair) {
					sair.addEventListener('click', event => {
						event.preventDefault();
						localStorage.clear();
						window.location.assign('/login');
					});
				}

				if (dashboard) {
					dashboard.addEventListener('click', () => {
						window.history.back();
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
