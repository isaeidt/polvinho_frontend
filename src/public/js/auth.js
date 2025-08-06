export function getLoggedInUser() {
	const userData = localStorage.getItem('userLogin');
	if (!userData) {
		return null;
	}
	try {
		const loginData = JSON.parse(userData);
		return loginData.user;
	} catch {
		console.error('Erro nos dados do usuário');
		return null;
	}
}

export function getToken() {
	const userData = localStorage.getItem('userLogin');
	if (!userData) {
		return null;
	}
	try {
		return JSON.parse(userData).token;
	} catch {
		return null;
	}
}
