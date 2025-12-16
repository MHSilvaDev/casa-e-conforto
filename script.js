// 1. BANCO DE DADOS (Simulação)
const produtos = [
    {
        id: 1,
        nome: "Mini Processador USB",
        categoria: "cozinha",
        preco: 47.90,
        nota: 4.9,
        // Dica: Se você não baixou as imagens, o código usará o link da web automaticamente
        img: "assets/img/produtos/triturador.jpg", 
        promocao: true
    },
    {
        id: 2,
        nome: "Organizador de Pia Multifuncional",
        categoria: "organizacao",
        preco: 89.90,
        nota: 4.5,
        img: "assets/img/produtos/organizador.jpg",
        promocao: false
    },
    {
        id: 3,
        nome: "Kit Facas Chef Inox (5 Pcs)",
        categoria: "cozinha",
        preco: 99.90,
        nota: 5.0,
        img: "assets/img/produtos/kit-facas.jpg",
        promocao: true
    },
    {
        id: 4,
        nome: "Dispenser Automático Sabão",
        categoria: "banheiro", // categoria extra para teste
        preco: 35.00,
        nota: 4.2,
        img: "assets/img/produtos/dispenser.jpg",
        promocao: false
    },
    {
        id: 5,
        nome: "Vaso Decorativo Robert Plant",
        categoria: "decoracao",
        preco: 29.90,
        nota: 4.8,
        img: "assets/img/produtos/vaso.jpg",
        promocao: false
    },
    {
        id: 6,
        nome: "Potes Herméticos (Kit 10)",
        categoria: "organizacao",
        preco: 149.90,
        nota: 4.9,
        img: "assets/img/produtos/potes.jpg",
        promocao: true
    }
];

// Variável para controlar o carrinho
let carrinho = [];

// 2. RENDERIZAÇÃO (Desenha os produtos na tela)
function renderizarProdutos(lista = produtos) {
    const container = document.getElementById('container-produtos');
    container.innerHTML = ''; // Limpa a tela antes de desenhar

    if (lista.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    lista.forEach(produto => {
        const html = `
            <div class="product-card">
                ${produto.promocao ? '<div class="badge">Frete Grátis</div>' : ''}
                
                <img src="${produto.img}" onerror="this.src='https://via.placeholder.com/300x300?text=${produto.nome.split(' ')[0]}'" alt="${produto.nome}">
                
                <div class="p-info">
                    <h3>${produto.nome}</h3>
                    <div class="stars">⭐ ${produto.nota}</div>
                    <p class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-add" onclick="adicionarAoCarrinho(${produto.id})">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// 3. FILTRO POR CATEGORIA
function filtrarPorCategoria(categoria) {
    // Filtra o array original
    const filtrados = produtos.filter(p => p.categoria === categoria);
    
    // Chama a renderização apenas com os filtrados
    renderizarProdutos(filtrados);
    
    // Feedback visual (opcional): rolar até a vitrine
    document.getElementById('vitrine').scrollIntoView({behavior: 'smooth'});
}

// 4. ADICIONAR AO CARRINHO
function adicionarAoCarrinho(idProduto) {
    const item = produtos.find(p => p.id === idProduto);
    
    if (item) {
        carrinho.push(item);
        salvarCarrinhoNoStorage();
        atualizarContador();
        mostrarNotificacao(item.nome);
    }
}

// Atualiza a bolinha vermelha no ícone do carrinho
function atualizarContador() {
    const contador = document.getElementById('cart-count');
    contador.innerText = carrinho.length;
    
    // Efeito de "pulo" no ícone
    contador.parentElement.style.transform = "scale(1.2)";
    setTimeout(() => {
        contador.parentElement.style.transform = "scale(1)";
    }, 200);
}

// 5. NOTIFICAÇÃO (TOAST)
function mostrarNotificacao(nomeProduto) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.classList.add('toast');
    toast.innerHTML = `✅ <strong>${nomeProduto}</strong> adicionado!`;
    
    container.appendChild(toast);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0'; // Efeito de sumir devagar
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// 6. INICIALIZAR
// Quando a página carrega, desenha todos os produtos
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
});

// --- LÓGICA DO CARRINHO (NOVA) ---

function abrirCarrinho() {
    
    const modal = document.getElementById('modal-carrinho');
    const containerItens = document.getElementById('lista-itens-carrinho');
    const spanTotal = document.getElementById('texto-total-preco');

    document.getElementById('view-carrinho').style.display = 'block';
    document.getElementById('view-checkout').style.display = 'none';
    document.getElementById('modal-titulo').innerText = 'Seu Carrinho';

    // 1. Limpar a lista anterior
    containerItens.innerHTML = '';

    // 2. Verificar se está vazio
    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p style="text-align:center; color:#777;">O teu carrinho está vazio.</p>';
        spanTotal.innerText = 'R$ 0,00';
        modal.style.display = 'flex'; // Mostra o modal
        return;
    }

    // 3. Desenhar os itens e Somar o Total
    let total = 0;

    carrinho.forEach(item => {
        // Criar o HTML de cada item
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span>${item.nome}</span>
            <strong>R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
        `;
        containerItens.appendChild(div);

        // Somar ao total
        total += item.preco;
    });

    // 4. Atualizar o texto do Total
    spanTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // 5. Mostrar o modal (mudando o display de 'none' para 'flex')
    modal.style.display = 'flex';
}

function fecharCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    modal.style.display = 'none';
}

function irParaCheckout() {
    if (carrinho.length === 0) {
        mostrarNotificacao("Seu carrinho está vazio!");
        return;
    }

    document.getElementById('view-carrinho').style.display = 'none';
    document.getElementById('view-checkout').style.display = 'block';
    document.getElementById('modal-titulo').innerText = 'Finalizar Pedido';
}

// 2. Volta para a lista de itens
function voltarParaCarrinho() {
    document.getElementById('view-carrinho').style.display = 'block';
    document.getElementById('view-checkout').style.display = 'none';
    document.getElementById('modal-titulo').innerText = 'Seu Carrinho';
}

// 3. Processa o formulário (Simulação de envio)
// MODIFIQUE A SUA FUNÇÃO finalizarPedido ATUAL POR ESTA:
function finalizarPedido(event) {
    event.preventDefault();
    
    // Captura os dados
    const pagamento = document.querySelector('select').value;
    
    // Validação simples
    if (carrinho.length === 0) return;
    if (pagamento === "") {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    // Se escolheu PIX, abre o modal fake
    if (pagamento === "pix") {
        abrirModalPix();
    } else {
        // Se for Cartão, segue o fluxo antigo (simulação ou WhatsApp)
        alert("Redirecionando para o gateway de cartão...");
        // Aqui você colocaria a lógica do cartão ou WhatsApp
    }
}

// --- NOVAS FUNÇÕES DO PIX ---

function abrirModalPix() {
    // 1. Calcula o total
    const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    
    // 2. Atualiza o texto do valor
    document.getElementById('valor-pix-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // 3. Gera um código aleatório simulando o "Payload" do Pix
    const codigoAleatorio = "00020126580014br.gov.bcb.pix0136" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + "5204000053039865802BR5913CasaConforto6008SaoPaulo62070503***6304";
    
    // 4. Insere no input
    document.getElementById('pix-copia-cola').value = codigoAleatorio;
    
    // 5. Gera a imagem do QR Code usando uma API gratuita (api.qrserver.com)
    // Passamos o código aleatório como dado para gerar a imagem
    document.getElementById('img-qrcode').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${codigoAleatorio}`;
    
    // 6. Mostra o modal
    document.getElementById('modal-pix').style.display = 'flex';
}

function fecharModalPix() {
    document.getElementById('modal-pix').style.display = 'none';
}

function copiarCodigoPix() {
    const inputPix = document.getElementById('pix-copia-cola');
    
    // Seleciona o texto e copia para a área de transferência
    inputPix.select();
    inputPix.setSelectionRange(0, 99999); // Para mobile
    
    navigator.clipboard.writeText(inputPix.value).then(() => {
        mostrarNotificacao("Código Pix copiado!");
    });
}

function simularAprovacao() {
    const btn = document.querySelector('.btn-ja-paguei');
    btn.innerText = "Verificando...";
    btn.disabled = true;

    // Simula um delay de verificação bancária
    setTimeout(() => {
        btn.innerText = "PAGAMENTO APROVADO! ✅";
        btn.style.background = "#27ae60";
        
        setTimeout(() => {
            alert("Sucesso! Seu pedido foi processado.");
            // Limpa tudo
            carrinho = [];
            localStorage.removeItem('meuCarrinho');
            atualizarContador();
            fecharModalPix();
            fecharCarrinho();
            document.getElementById('form-checkout').reset();
            
            // Restaura o botão
            btn.innerText = "JÁ FIZ O PAGAMENTO";
            btn.style.background = "#32bcad";
            btn.disabled = false;
        }, 1000);
    }, 2000);
}

function salvarCarrinhoNoStorage() {
    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    
    // Recupera os dados salvos
    const dadosSalvos = localStorage.getItem('meuCarrinho');
    if (dadosSalvos) {
        carrinho = JSON.parse(dadosSalvos);
        atualizarContador();
    }
});

// Opcional: Fechar o modal se clicar fora da caixa branca
window.onclick = function(event) {
    const modal = document.getElementById('modal-carrinho');
    if (event.target === modal) {
        fecharCarrinho();
    }
}