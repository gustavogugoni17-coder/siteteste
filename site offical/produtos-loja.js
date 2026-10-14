// ==========================================
// PRODUTOS-LOJA.JS
// SITE
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const listaProdutos =
        document.getElementById("listaProdutosLoja");

    const pesquisa =
        document.getElementById("pesquisaProdutosLoja");

    const listaCarrinho =
        document.getElementById("listaCarrinho");

    const quantidadeItens =
        document.getElementById("quantidadeItens");

    const totalCarrinho =
        document.getElementById("totalCarrinho");

    const btnFinalizar =
        document.getElementById("btnFinalizarPedido");


    // ==========================================
    // PEGAR PRODUTOS
    // ==========================================

    function pegarProdutos() {

        try {

            const dados =
                localStorage.getItem("produtosShalom");

            if (!dados) {
                return [];
            }

            const produtos = JSON.parse(dados);

            return Array.isArray(produtos)
                ? produtos
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

            return [];
        }
    }


    // ==========================================
    // PEGAR CARRINHO
    // ==========================================

    function pegarCarrinho() {

        try {

            // Primeiro tenta o carrinho atual
            let dados =
                localStorage.getItem("carrinhoCompra");

            // Compatibilidade com versão antiga
            if (!dados) {

                dados =
                    localStorage.getItem(
                        "carrinhoShalom"
                    );
            }

            if (!dados) {
                return [];
            }

            const carrinho =
                JSON.parse(dados);

            return Array.isArray(carrinho)
                ? carrinho
                : [];

        } catch (erro) {

            console.error(
                "Erro ao carregar carrinho:",
                erro
            );

            return [];
        }
    }


    // ==========================================
    // SALVAR CARRINHO
    // ==========================================

    function salvarCarrinho(carrinho) {

        localStorage.setItem(
            "carrinhoCompra",
            JSON.stringify(carrinho)
        );

        // Mantém compatibilidade com páginas antigas
        localStorage.setItem(
            "carrinhoShalom",
            JSON.stringify(carrinho)
        );
    }


    // ==========================================
    // FORMATAR MOEDA
    // ==========================================

    function formatarMoeda(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    // ==========================================
    // ESCAPAR HTML
    // ==========================================

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // MOSTRAR PRODUTOS
    // ==========================================

    function mostrarProdutos() {

        if (!listaProdutos) {
            return;
        }

        const produtos =
            pegarProdutos();

        const termo =
            pesquisa
                ? pesquisa.value.trim().toLowerCase()
                : "";

        const produtosFiltrados =
            produtos.filter(produto => {

                const nome =
                    String(
                        produto.nome || ""
                    ).toLowerCase();

                const observacao =
                    String(
                        produto.observacao || ""
                    ).toLowerCase();

                return (
                    nome.includes(termo) ||
                    observacao.includes(termo)
                );
            });


        // ==========================================
        // NENHUM PRODUTO
        // ==========================================

        if (produtosFiltrados.length === 0) {

            listaProdutos.innerHTML = `
                <div class="carrinho-vazio">

                    <div class="icone-carrinho">
                        📦
                    </div>

                    <h3>
                        Nenhum produto encontrado
                    </h3>

                    <p>
                        Não existem produtos disponíveis
                        para exibir.
                    </p>

                </div>
            `;

            return;
        }


        // ==========================================
        // PRODUTOS
        // ==========================================

        listaProdutos.innerHTML =
            produtosFiltrados.map(produto => {

                const id =
                    String(produto.id);

                const nome =
                    escaparHTML(
                        produto.nome ||
                        "Produto"
                    );

                const preco =
                    Number(produto.preco) || 0;

                const estoque =
                    Number(produto.estoque) || 0;

                const observacao =
                    String(
                        produto.observacao || ""
                    ).trim();

                const imagem =
                    String(
                        produto.imagem || ""
                    ).trim();


                // ==========================================
                // IMAGEM
                // ==========================================

                let areaImagem = "";

                if (imagem) {

                    areaImagem = `
                        <img
                            src="${escaparHTML(imagem)}"
                            alt="${nome}"
                            class="imagem-produto-loja"
                            onerror="
                                this.style.display='none';
                                this.nextElementSibling.style.display='flex';
                            "
                        >

                        <div
                            class="sem-imagem-produto"
                            style="display:none;"
                        >
                            📦
                        </div>
                    `;

                } else {

                    areaImagem = `
                        <div class="sem-imagem-produto">
                            📦
                        </div>
                    `;
                }


                // ==========================================
                // ESTOQUE
                // ==========================================

                let textoEstoque = "";

                if (estoque <= 0) {

                    textoEstoque = `
                        <div
                            class="estoque-produto"
                            style="color:#c62828;"
                        >
                            ❌ Produto indisponível
                        </div>
                    `;

                } else {

                    textoEstoque = `
                        <div class="estoque-produto">
                            🟩 ${estoque} unidades disponíveis
                        </div>
                    `;
                }


                // ==========================================
                // OBSERVAÇÃO
                // ==========================================

                let blocoObservacao = "";

                if (observacao) {

                    blocoObservacao = `
                        <div class="observacao-produto">
                            📝 ${escaparHTML(observacao)}
                        </div>
                    `;
                }


                // ==========================================
                // BOTÃO
                // ==========================================

                let botao = "";

                if (estoque <= 0) {

                    botao = `
                        <button
                            type="button"
                            class="btn-produto indisponivel"
                            disabled
                        >
                            ❌ Sem estoque
                        </button>
                    `;

                } else {

                    botao = `
                        <button
                            type="button"
                            class="btn-produto"
                            data-id="${escaparHTML(id)}"
                        >
                            🛒 Adicionar ao pedido
                        </button>
                    `;
                }


                // ==========================================
                // CARD
                // ==========================================

                return `
                    <article
                        class="produto-card-loja"
                    >

                        <div class="imagem-container-produto">

                            ${areaImagem}

                        </div>


                        <div class="produto-conteudo">

                            <h3>
                                ${nome}
                            </h3>


                            <div class="preco-produto">
                                ${formatarMoeda(preco)}
                            </div>


                            ${textoEstoque}


                            ${blocoObservacao}


                            ${botao}

                        </div>

                    </article>
                `;

            }).join("");


        // ==========================================
        // EVENTOS DOS BOTÕES
        // ==========================================

        const botoes =
            listaProdutos.querySelectorAll(
                ".btn-produto[data-id]"
            );

        botoes.forEach(botao => {

            botao.addEventListener(
                "click",
                function () {

                    const id =
                        this.dataset.id;

                    adicionarProdutoPedido(id);
                }
            );
        });
    }


    // ==========================================
    // ADICIONAR PRODUTO AO PEDIDO
    // ==========================================

    function adicionarProdutoPedido(idProduto) {

        const produtos =
            pegarProdutos();


        const produto =
            produtos.find(
                p =>
                    String(p.id) ===
                    String(idProduto)
            );


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;
        }


        const estoque =
            Number(produto.estoque) || 0;


        if (estoque <= 0) {

            alert(
                "Este produto está sem estoque."
            );

            return;
        }


        let carrinho =
            pegarCarrinho();


        const existente =
            carrinho.find(
                item =>
                    String(item.id) ===
                    String(produto.id)
            );


        // ==========================================
        // PRODUTO JÁ NO CARRINHO
        // ==========================================

        if (existente) {

            const quantidadeAtual =
                Number(
                    existente.quantidade
                ) || 0;


            if (
                quantidadeAtual >=
                estoque
            ) {

                alert(
                    "Você atingiu o limite disponível em estoque."
                );

                return;
            }


            existente.quantidade =
                quantidadeAtual + 1;

        }


        // ==========================================
        // NOVO PRODUTO
        // ==========================================

        else {

            carrinho.push({

                id: produto.id,

                nome:
                    produto.nome,

                preco:
                    Number(
                        produto.preco
                    ) || 0,

                imagem:
                    produto.imagem || "",

                quantidade: 1

            });
        }


        // ==========================================
        // SALVAR
        // ==========================================

        salvarCarrinho(
            carrinho
        );


        // ==========================================
        // ATUALIZAR TELA
        // ==========================================

        mostrarCarrinho();


        // ==========================================
        // ATUALIZAR PRODUTOS
        // ==========================================

        mostrarProdutos();


        // ==========================================
        // MENSAGEM
        // ==========================================

        mostrarMensagemAdicionado(
            produto.nome
        );
    }


    // ==========================================
    // MENSAGEM DE PRODUTO ADICIONADO
    // ==========================================

    function mostrarMensagemAdicionado(nome) {

        const mensagem =
            document.createElement("div");

        mensagem.textContent =
            `✓ ${nome} foi adicionado ao pedido.`;

        mensagem.style.position =
            "fixed";

        mensagem.style.right =
            "20px";

        mensagem.style.bottom =
            "20px";

        mensagem.style.zIndex =
            "9999";

        mensagem.style.background =
            "#168000";

        mensagem.style.color =
            "#ffffff";

        mensagem.style.padding =
            "14px 20px";

        mensagem.style.borderRadius =
            "8px";

        mensagem.style.fontWeight =
            "bold";

        mensagem.style.boxShadow =
            "0 5px 20px rgba(0,0,0,.20)";


        document.body.appendChild(
            mensagem
        );


        setTimeout(() => {

            mensagem.remove();

        }, 2200);
    }


    // ==========================================
    // MOSTRAR CARRINHO
    // ==========================================

    function mostrarCarrinho() {

        if (!listaCarrinho) {
            return;
        }


        const carrinho =
            pegarCarrinho();


        // ==========================================
        // CARRINHO VAZIO
        // ==========================================

        if (carrinho.length === 0) {

            listaCarrinho.innerHTML = `

                <div class="carrinho-vazio">

                    <div class="icone-carrinho">
                        🛒
                    </div>

                    <h3>
                        Seu pedido está vazio
                    </h3>

                    <p>
                        Adicione produtos para
                        começar seu pedido.
                    </p>

                </div>

            `;

            atualizarResumoCarrinho();

            return;
        }


        // ==========================================
        // ITENS
        // ==========================================

        listaCarrinho.innerHTML =
            carrinho.map(item => {

                const quantidade =
                    Number(
                        item.quantidade
                    ) || 1;

                const preco =
                    Number(
                        item.preco
                    ) || 0;

                const subtotal =
                    preco * quantidade;

                const imagem =
                    String(
                        item.imagem || ""
                    ).trim();


                let imagemHTML = "";

                if (imagem) {

                    imagemHTML = `
                        <img
                            src="${escaparHTML(imagem)}"
                            alt="${escaparHTML(item.nome)}"
                            class="item-carrinho-imagem"
                            onerror="
                                this.style.display='none';
                            "
                        >
                    `;

                } else {

                    imagemHTML = `
                        <div
                            class="item-carrinho-imagem"
                            style="
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                font-size:25px;
                            "
                        >
                            📦
                        </div>
                    `;
                }


                return `

                    <div
                        class="item-carrinho"
                        data-id="${escaparHTML(item.id)}"
                    >

                        ${imagemHTML}


                        <div class="item-carrinho-info">

                            <strong>
                                ${escaparHTML(item.nome)}
                            </strong>


                            <div class="item-carrinho-preco">
                                ${formatarMoeda(preco)}
                                cada
                            </div>


                            <div class="controle-quantidade">

                                <button
                                    type="button"
                                    class="btn-diminuir"
                                    data-id="${escaparHTML(item.id)}"
                                >
                                    −
                                </button>


                                <span>
                                    ${quantidade}
                                </span>


                                <button
                                    type="button"
                                    class="btn-aumentar"
                                    data-id="${escaparHTML(item.id)}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <div
                            style="
                                text-align:right;
                                min-width:90px;
                            "
                        >

                            <strong>
                                ${formatarMoeda(subtotal)}
                            </strong>


                            <button
                                type="button"
                                class="btn-remover-item"
                                data-id="${escaparHTML(item.id)}"
                                title="Remover produto"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


        // ==========================================
        // BOTÕES +
        // ==========================================

        listaCarrinho
            .querySelectorAll(
                ".btn-aumentar"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        alterarQuantidade(
                            botao.dataset.id,
                            1
                        );

                    }
                );

            });


        // ==========================================
        // BOTÕES -
        // ==========================================

        listaCarrinho
            .querySelectorAll(
                ".btn-diminuir"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        alterarQuantidade(
                            botao.dataset.id,
                            -1
                        );

                    }
                );

            });


        // ==========================================
        // BOTÕES REMOVER
        // ==========================================

        listaCarrinho
            .querySelectorAll(
                ".btn-remover-item"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        removerProduto(
                            botao.dataset.id
                        );

                    }
                );

            });


        atualizarResumoCarrinho();
    }


    // ==========================================
    // ALTERAR QUANTIDADE
    // ==========================================

    function alterarQuantidade(
        idProduto,
        alteracao
    ) {

        const produtos =
            pegarProdutos();

        const carrinho =
            pegarCarrinho();


        const produto =
            produtos.find(
                p =>
                    String(p.id) ===
                    String(idProduto)
            );


        const item =
            carrinho.find(
                i =>
                    String(i.id) ===
                    String(idProduto)
            );


        if (!item) {
            return;
        }


        let novaQuantidade =
            Number(item.quantidade) +
            Number(alteracao);


        // ==========================================
        // DIMINUIR ATÉ ZERO
        // ==========================================

        if (novaQuantidade <= 0) {

            removerProduto(
                idProduto
            );

            return;
        }


        // ==========================================
        // LIMITE DO ESTOQUE
        // ==========================================

        if (produto) {

            const estoque =
                Number(
                    produto.estoque
                ) || 0;


            if (
                novaQuantidade >
                estoque
            ) {

                alert(
                    "Quantidade maior que o estoque disponível."
                );

                return;
            }
        }


        item.quantidade =
            novaQuantidade;


        salvarCarrinho(
            carrinho
        );


        mostrarCarrinho();
    }


    // ==========================================
    // REMOVER PRODUTO
    // ==========================================

    function removerProduto(
        idProduto
    ) {

        let carrinho =
            pegarCarrinho();


        carrinho =
            carrinho.filter(
                item =>
                    String(item.id) !==
                    String(idProduto)
            );


        salvarCarrinho(
            carrinho
        );


        mostrarCarrinho();

        mostrarProdutos();
    }


    // ==========================================
    // ATUALIZAR RESUMO
    // ==========================================

    function atualizarResumoCarrinho() {

        const carrinho =
            pegarCarrinho();


        let quantidadeTotal = 0;

        let valorTotal = 0;


        carrinho.forEach(item => {

            const quantidade =
                Number(
                    item.quantidade
                ) || 0;

            const preco =
                Number(
                    item.preco
                ) || 0;


            quantidadeTotal +=
                quantidade;

            valorTotal +=
                quantidade * preco;

        });


        if (quantidadeItens) {

            quantidadeItens.textContent =
                `${quantidadeTotal} ${
                    quantidadeTotal === 1
                        ? "item"
                        : "itens"
                }`;
        }


        if (totalCarrinho) {

            totalCarrinho.textContent =
                formatarMoeda(
                    valorTotal
                );
        }


        if (btnFinalizar) {

            btnFinalizar.disabled =
                carrinho.length === 0;


            btnFinalizar.style.opacity =
                carrinho.length === 0
                    ? "0.5"
                    : "1";

            btnFinalizar.style.cursor =
                carrinho.length === 0
                    ? "not-allowed"
                    : "pointer";
        }
    }


    // ==========================================
    // FINALIZAR / CONTINUAR PEDIDO
    // ==========================================

    if (btnFinalizar) {

        btnFinalizar.addEventListener(
            "click",
            function () {

                const carrinho =
                    pegarCarrinho();


                if (
                    !carrinho ||
                    carrinho.length === 0
                ) {

                    alert(
                        "Adicione pelo menos um produto ao pedido."
                    );

                    return;
                }


                window.location.href =
                    "comprar.html";
            }
        );
    }


    // ==========================================
    // PESQUISA
    // ==========================================

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            function () {

                mostrarProdutos();

            }
        );
    }


    // ==========================================
    // ATUALIZAR SE OUTRA PÁGINA ALTERAR
    // ==========================================

    window.addEventListener(
        "storage",
        function (evento) {

            if (
                evento.key ===
                    "produtosShalom" ||
                evento.key ===
                    "carrinhoCompra" ||
                evento.key ===
                    "carrinhoShalom"
            ) {

                mostrarProdutos();

                mostrarCarrinho();
            }
        }
    );


    // ==========================================
    // DISPONIBILIZAR FUNÇÃO GLOBAL
    // ==========================================

    window.adicionarProdutoPedido =
        adicionarProdutoPedido;


    // ==========================================
    // INICIAR
    // ==========================================

    mostrarProdutos();

    mostrarCarrinho();

});