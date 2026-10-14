// ==========================================
// FINALIZAÇÃO DO PEDIDO
// SITE
// ==========================================

(() => {
    "use strict";

    const form = document.getElementById("pedidoForm");
    const resumoFinal = document.getElementById("resumoFinal");

    if (!form || !resumoFinal) return;

    const CHAVE_CARRINHO = "carrinhoCompra";
    const CHAVE_PEDIDOS = "pedidosShalom";
    const CHAVE_PRODUTOS = "produtosShalom";

    function moeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function lerJSON(chave, padrao) {
        try {
            const valor = JSON.parse(localStorage.getItem(chave) || "null");
            return valor ?? padrao;
        } catch {
            return padrao;
        }
    }

    function escapar(texto) {
        return String(texto ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[c]));
    }

    const carrinho = lerJSON(CHAVE_CARRINHO, []);

    if (!Array.isArray(carrinho) || carrinho.length === 0) {
        alert("Seu pedido está vazio.");
        window.location.href = "index.html";
        return;
    }

    const total = carrinho.reduce((soma, item) => {
        return soma + (Number(item.preco) || 0) * (Number(item.quantidade) || 0);
    }, 0);

    resumoFinal.innerHTML = `
        <div class="resumo-titulo">🛒 Resumo do pedido</div>
        <div class="resumo-itens">
            ${carrinho.map(item => `
                <div class="resumo-item">
                    <span>${Number(item.quantidade) || 0}x ${escapar(item.nome || "Produto")}</span>
                    <strong>${moeda((Number(item.preco) || 0) * (Number(item.quantidade) || 0))}</strong>
                </div>
            `).join("")}
        </div>
        <div class="resumo-total">
            <span>Total</span>
            <strong>${moeda(total)}</strong>
        </div>
    `;

    // Preenche automaticamente o nome do cliente logado quando disponível.
    const nomeSalvo = localStorage.getItem("usuarioNome") || localStorage.getItem("clienteNome") || "";
    const emailSalvo = localStorage.getItem("usuarioLogado") || "";
    const campoNome = document.getElementById("nome");

    if (campoNome && !campoNome.value && nomeSalvo) {
        campoNome.value = nomeSalvo;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const botao = form.querySelector('button[type="submit"]');
        if (botao && botao.disabled) return;

        const pagamento = document.querySelector('input[name="pagamento"]:checked');

        if (!pagamento) {
            alert("Escolha uma forma de pagamento.");
            return;
        }

        const produtos = lerJSON(CHAVE_PRODUTOS, []);

        if (!Array.isArray(produtos)) {
            alert("Não foi possível verificar o estoque.");
            return;
        }

        // Confere o estoque novamente antes de registrar o pedido.
        for (const item of carrinho) {
            const produto = produtos.find(p => String(p.id) === String(item.id));
            const estoque = produto ? Number(produto.estoque) || 0 : 0;
            const quantidade = Number(item.quantidade) || 0;

            if (!produto) {
                alert(`O produto "${item.nome}" não está mais disponível.`);
                return;
            }

            if (quantidade <= 0 || quantidade > estoque) {
                alert(`O produto "${item.nome}" possui apenas ${estoque} unidade(s) disponível(is).`);
                return;
            }
        }

        const pedido = {
            id: Date.now(),
            nome: document.getElementById("nome")?.value.trim() || "Cliente",
            email: emailSalvo,
            telefone: document.getElementById("telefone")?.value.trim() || "",
            endereco: {
                rua: document.getElementById("endereco")?.value.trim() || "",
                numero: document.getElementById("numero")?.value.trim() || "",
                complemento: document.getElementById("complemento")?.value.trim() || "",
                bairro: document.getElementById("bairro")?.value.trim() || "",
                cidade: document.getElementById("cidade")?.value.trim() || "",
                cep: document.getElementById("cep")?.value.trim() || ""
            },
            pagamento: pagamento.value,
            observacao: document.getElementById("observacao")?.value.trim() || "",
            produtos: carrinho,
            total: Number(total.toFixed(2)),
            data: new Date().toISOString(),
            status: "Pendente"
        };

        const pedidos = lerJSON(CHAVE_PEDIDOS, []);
        if (!Array.isArray(pedidos)) {
            alert("Não foi possível salvar o pedido.");
            return;
        }

        pedidos.push(pedido);

        // Baixa o estoque somente depois de validar tudo.
        const produtosAtualizados = produtos.map(produto => {
            const item = carrinho.find(p => String(p.id) === String(produto.id));
            if (!item) return produto;

            return {
                ...produto,
                estoque: Math.max(
                    0,
                    (Number(produto.estoque) || 0) - (Number(item.quantidade) || 0)
                )
            };
        });

        try {
            localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(pedidos));
            localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtosAtualizados));
            localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
            localStorage.removeItem(CHAVE_CARRINHO);
        } catch (erro) {
            console.error("Erro ao salvar pedido:", erro);
            alert("Não foi possível salvar o pedido. Tente novamente.");
            return;
        }

        if (botao) {
            botao.disabled = true;
            botao.textContent = "Pedido registrado...";
        }

        window.location.href = "pedido-confirmado.html";
    });
})();
