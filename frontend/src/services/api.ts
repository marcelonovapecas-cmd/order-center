const API_URL = 'http://localhost:3000';

export async function testarApi() {
    const resposta = await fetch(`${API_URL}/`);

    if (!resposta.ok) {
        throw new Error('Erro ao acessar a API');
    }

    return resposta.json();
}