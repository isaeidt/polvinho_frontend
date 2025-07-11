document.addEventListener('DOMContentLoaded', function () {
	const sidebarContainer = document.getElementById('sidebar');

	if (sidebarContainer) {
		//
		fetch('../components/html/sidebar.html')
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(html => {
				sidebarContainer.innerHTML = html;
			})
			.catch(error => {
				console.error('Erro ao carregar a sidebar:', error);
				sidebarContainer.innerHTML = `<p>Erro ao carregar a sidebar. Verifique o caminho no console (F12).</p>`;
			});
	}
});
