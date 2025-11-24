let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = [];

// Função para normalizar strings: remove acentos, cedilha e converte para minúsculas.
function normalizarString(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


async function iniciarBusca() {
    // Se os dados ainda não foram carregados, busca do JSON.
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; // Interrompe a execução se houver erro
        }
    }

    // 1. Separa os termos de busca por vírgula, remove espaços e normaliza cada um.
    const termosDeBusca = campoBusca.value.split(' ')
        .map(termo => normalizarString(termo.trim()))
        .filter(termo => termo.length > 0); // Remove termos vazios

    console.log("Buscando por:", termosDeBusca);

    // 2. Filtra os dados: a receita deve conter TODOS os termos pesquisados.
    const dadosFiltrados = dados.filter(dado => {
        return termosDeBusca.every(termo => 
            normalizarString(dado.nome).includes(termo) ||
            dado.ingredientes.some(ingrediente => normalizarString(ingrediente).includes(termo)) ||
            dado.equipamentos.some(equipamento => normalizarString(equipamento).includes(termo))
        );                        
    });

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        let lista_ingredientes = "<p>Ingredientes</p><ul>";
        for (let ingrediente of dado.ingredientes) {
            lista_ingredientes += `<li>${ingrediente}</li>`;
        }
        lista_ingredientes += "</ul>";

        let lista_equipamentos = "<p>Equipamentos</p><ul>";
        for (let equipamento of dado.equipamentos) {
            lista_equipamentos += `<li>${equipamento}</li>`;
        }
        lista_equipamentos += "</ul>";
        
        
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.tempo_preparo}</p>
        <p>${lista_ingredientes}</p>
        <p>${lista_equipamentos}</p>
        <p>${dado.modo_preparo}</p>

        `
        cardContainer.appendChild(article);
    }
}