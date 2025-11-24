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
        let lista_ingredientes = "<ul>";
        for (let ingrediente of dado.ingredientes) {
            lista_ingredientes += `<li>${ingrediente}</li>`;
        }
        lista_ingredientes += "</ul>";

        let lista_equipamentos = "<ul>";
        for (let equipamento of dado.equipamentos) {
            lista_equipamentos += `<li>${equipamento}</li>`;
        }
        lista_equipamentos += "</ul>";
        
        
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>Tempo de Preparo:</strong>\n${dado.tempo_preparo}</p>
        <p><strong>Ingredientes:</strong>\n${lista_ingredientes}</p>
        <p><strong>Equipamentos:</strong>\n${lista_equipamentos}</p>
        <p><strong>Modo de Preparo:</strong>\n${dado.modo_preparo}</p>

        `
        cardContainer.appendChild(article);
    }
}

// Captura o campo de input pelo ID
const campo_Busca = document.getElementById('search');

// Adiciona um ouvinte de evento para 'keydown' (tecla pressionada)
campo_Busca.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada é a 'Enter' (código 13 ou 'Enter')
    if (event.key === 'Enter' || event.keyCode === 13) {
        // Previne o comportamento padrão do Enter em formulários (como recarregar a página)
        event.preventDefault();
        
        // Chama a função desejada
        iniciarBusca();
    }
});