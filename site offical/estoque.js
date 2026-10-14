// ==========================================
// ESTOQUE.JS
// GERENCIADOR DE PRODUTOS - ADMIN
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // Proteção do painel administrativo
    if (localStorage.getItem("tipoUsuario") !== "admin") {
        window.location.href = "login.html";
        return;
    }

    // ==========================================
    // CONFIGURAÇÃO
    // ==========================================

    const CHAVE = "produtosShalom";


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const form =
        document.getElementById("formProduto");

    const produtoId =
        document.getElementById("produtoId");

    const nomeProduto =
        document.getElementById("nomeProduto");

    const precoProduto =
        document.getElementById("precoProduto");

    const estoqueProduto =
        document.getElementById("estoqueProduto");

    const imagemProduto =
        document.getElementById("imagemProduto");

    const observacaoProduto =
        document.getElementById("observacaoProduto");

    const listaProdutos =
        document.getElementById("listaProdutos");

    const mensagem =
        document.getElementById("mensagem");

    const btnLimpar =
        document.getElementById("btnLimpar");

    const tituloFormulario =
        document.getElementById("tituloFormulario");

    const totalProdutos =
        document.getElementById("totalProdutos");

    const totalEstoque =
        document.getElementById("totalEstoque");

    const valorEstoque =
        document.getElementById("valorEstoque");


    // ==========================================
    // PEGAR PRODUTOS
    // ==========================================

    function pegarProdutos() {

        try {

            const dados =
                localStorage.getItem(CHAVE);

            if (!dados) {
                return [];
            }

            const produtos =
                JSON.parse(dados);

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
    // SALVAR PRODUTOS
    // ==========================================

    function salvarProdutos(produtos) {

        localStorage.setItem(
            CHAVE,
            JSON.stringify(produtos)
        );
    }


    // ==========================================
    // MOEDA
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
    // LIMPAR FORMULÁRIO
    // ==========================================

    function limparFormulario() {

        if (form) {
            form.reset();
        }

        if (produtoId) {
            produtoId.value = "";
        }

        if (tituloFormulario) {
            tituloFormulario.textContent =
                "Adicionar produto";
        }

        if (mensagem) {
            mensagem.textContent = "";
        }
    }


    // ==========================================
    // MENSAGEM
    // ==========================================

    function mostrarMensagem(
        texto,
        tipo = "sucesso"
    ) {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = texto;

        mensagem.style.color =
            tipo === "erro"
                ? "#b00020"
                : "#168000";
    }


    // ==========================================
    // RESUMO
    // ==========================================

    function atualizarResumo(produtos) {

        let unidades = 0;
        let valor = 0;

        produtos.forEach(produto => {

            const estoque =
                Number(produto.estoque) || 0;

            const preco =
                Number(produto.preco) || 0;

            unidades += estoque;

            valor +=
                estoque * preco;
        });


        if (totalProdutos) {
            totalProdutos.textContent =
                produtos.length;
        }

        if (totalEstoque) {
            totalEstoque.textContent =
                unidades;
        }

        if (valorEstoque) {
            valorEstoque.textContent =
                formatarMoeda(valor);
        }
    }


    // ==========================================
    // MOSTRAR PRODUTOS CADASTRADOS
    // ==========================================

    function mostrarProdutos() {

        if (!listaProdutos) {
            return;
        }

        const produtos =
            pegarProdutos();

        listaProdutos.innerHTML = "";

        atualizarResumo(produtos);


        if (produtos.length === 0) {

            listaProdutos.innerHTML = `
                <div class="vazio">
                    Nenhum produto cadastrado.
                </div>
            `;

            return;
        }


        produtos.forEach(produto => {

            const card =
                document.createElement("article");

            card.className =
                "produto";


            // ==================================
            // IMAGEM
            // ==================================

            if (produto.imagem) {

                const img =
                    document.createElement("img");

                img.className =
                    "produto-imagem";

                img.src =
                    produto.imagem;

                img.alt =
                    produto.nome || "Produto";

                img.onerror = function () {

                    this.style.display =
                        "none";

                    const semImagem =
                        document.createElement("div");

                    semImagem.className =
                        "produto-sem-imagem";

                    semImagem.textContent =
                        "📦 Sem imagem";

                    this.parentElement.prepend(
                        semImagem
                    );
                };

                card.appendChild(img);

            } else {

                const semImagem =
                    document.createElement("div");

                semImagem.className =
                    "produto-sem-imagem";

                semImagem.textContent =
                    "📦 Sem imagem";

                card.appendChild(
                    semImagem
                );
            }


            // ==================================
            // INFORMAÇÕES
            // ==================================

            const info =
                document.createElement("div");

            info.className =
                "produto-info";


            const nome =
                document.createElement("h3");

            nome.textContent =
                produto.nome || "Produto";


            const preco =
                document.createElement("div");

            preco.className =
                "preco";

            preco.textContent =
                formatarMoeda(
                    produto.preco
                );


            const estoque =
                document.createElement("div");

            estoque.className =
                "estoque";

            estoque.textContent =
                `Estoque: ${Number(
                    produto.estoque
                ) || 0}`;


            if (
                Number(produto.estoque) <= 5
            ) {

                estoque.classList.add(
                    "estoque-baixo"
                );

            } else {

                estoque.classList.add(
                    "estoque-ok"
                );
            }


            info.appendChild(nome);
            info.appendChild(preco);
            info.appendChild(estoque);


            // ==================================
            // OBSERVAÇÃO
            // ==================================

            if (produto.observacao) {

                const observacao =
                    document.createElement("div");

                observacao.className =
                    "observacao";

                observacao.textContent =
                    `📝 ${produto.observacao}`;

                info.appendChild(
                    observacao
                );
            }


            // ==================================
            // BOTÕES
            // ==================================

            const botoes =
                document.createElement("div");

            botoes.className =
                "produto-botoes";


            const editar =
                document.createElement("button");

            editar.type = "button";

            editar.className =
                "btn-editar";

            editar.textContent =
                "✏️ Editar";

            editar.addEventListener(
                "click",
                () => editarProduto(produto.id)
            );


            const excluir =
                document.createElement("button");

            excluir.type = "button";

            excluir.className =
                "btn-excluir";

            excluir.textContent =
                "🗑️ Excluir";

            excluir.addEventListener(
                "click",
                () => excluirProduto(produto.id)
            );


            botoes.appendChild(editar);
            botoes.appendChild(excluir);

            info.appendChild(botoes);

            card.appendChild(info);

            listaProdutos.appendChild(card);
        });
    }


    // ==========================================
    // ADICIONAR / EDITAR PRODUTO
    // ==========================================

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const nome =
                    nomeProduto
                        ? nomeProduto.value.trim()
                        : "";


                const preco =
                    precoProduto
                        ? Number(precoProduto.value)
                        : NaN;


                const estoque =
                    estoqueProduto
                        ? Number(estoqueProduto.value)
                        : NaN;


                const imagem =
                    imagemProduto
                        ? imagemProduto.value.trim()
                        : "";


                const observacao =
                    observacaoProduto
                        ? observacaoProduto.value.trim()
                        : "";


                // ==============================
                // VALIDAÇÃO
                // ==============================

                if (!nome) {

                    mostrarMensagem(
                        "Digite o nome do produto.",
                        "erro"
                    );

                    return;
                }


                if (
                    Number.isNaN(preco) ||
                    preco < 0
                ) {

                    mostrarMensagem(
                        "Digite um preço válido.",
                        "erro"
                    );

                    return;
                }


                if (
                    Number.isNaN(estoque) ||
                    estoque < 0 ||
                    !Number.isInteger(estoque)
                ) {

                    mostrarMensagem(
                        "Digite uma quantidade válida.",
                        "erro"
                    );

                    return;
                }


                const produtos =
                    pegarProdutos();


                // ==============================
                // EDITAR
                // ==============================

                if (
                    produtoId &&
                    produtoId.value
                ) {

                    const index =
                        produtos.findIndex(
                            produto =>
                                String(produto.id) ===
                                String(produtoId.value)
                        );


                    if (index === -1) {

                        mostrarMensagem(
                            "Produto não encontrado.",
                            "erro"
                        );

                        return;
                    }


                    produtos[index] = {

                        ...produtos[index],

                        nome,
                        preco,
                        estoque,
                        imagem,
                        observacao
                    };


                    salvarProdutos(produtos);


                    mostrarMensagem(
                        "Produto atualizado com sucesso!"
                    );

                }

                // ==============================
                // NOVO PRODUTO
                // ==============================

                else {

                    const novoProduto = {

                        id: Date.now(),

                        nome,

                        preco,

                        estoque,

                        imagem,

                        observacao
                    };


                    produtos.push(
                        novoProduto
                    );


                    salvarProdutos(
                        produtos
                    );


                    mostrarMensagem(
                        "Produto adicionado com sucesso!"
                    );
                }


                limparFormulario();

                mostrarProdutos();

                mostrarRelacaoProdutos();
            }
        );
    }


    // ==========================================
    // EDITAR
    // ==========================================

    function editarProduto(id) {

        const produtos =
            pegarProdutos();


        const produto =
            produtos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!produto) {
            return;
        }


        if (produtoId) {
            produtoId.value =
                produto.id;
        }

        if (nomeProduto) {
            nomeProduto.value =
                produto.nome || "";
        }

        if (precoProduto) {
            precoProduto.value =
                produto.preco || 0;
        }

        if (estoqueProduto) {
            estoqueProduto.value =
                produto.estoque || 0;
        }

        if (imagemProduto) {
            imagemProduto.value =
                produto.imagem || "";
        }

        if (observacaoProduto) {
            observacaoProduto.value =
                produto.observacao || "";
        }

        if (tituloFormulario) {
            tituloFormulario.textContent =
                "Editar produto";
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // ==========================================
    // EXCLUIR
    // ==========================================

    function excluirProduto(id) {

        const produtos =
            pegarProdutos();


        const produto =
            produtos.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!produto) {
            return;
        }


        const confirmar =
            confirm(
                `Deseja excluir "${produto.nome}"?`
            );


        if (!confirmar) {
            return;
        }


        const novosProdutos =
            produtos.filter(
                item =>
                    String(item.id) !==
                    String(id)
            );


        salvarProdutos(
            novosProdutos
        );


        mostrarProdutos();

        mostrarRelacaoProdutos();


        mostrarMensagem(
            "Produto excluído com sucesso!"
        );
    }


    // ==========================================
    // BOTÃO LIMPAR
    // ==========================================

    if (btnLimpar) {

        btnLimpar.addEventListener(
            "click",
            limparFormulario
        );
    }


    // ==========================================
    // INICIAR
    // ==========================================

    mostrarProdutos();

    mostrarRelacaoProdutos();


    // ==========================================
    // ATUALIZAR QUANDO PRODUTOS MUDAR
    // ==========================================

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                CHAVE
            ) {

                mostrarProdutos();

                mostrarRelacaoProdutos();
            }
        }
    );


    // ==========================================
    // PESQUISA DA RELAÇÃO
    // ==========================================

    


    if (campoPesquisa) {

        campoPesquisa.addEventListener(
            "input",
            mostrarRelacaoProdutos
        );
    }


    // ==========================================
    // IMPRIMIR
    // ==========================================

    const btnImprimir =
        document.getElementById(
            "btnImprimirProdutos"
        );


    if (btnImprimir) {

        btnImprimir.addEventListener(
            "click",
            () => {

                window.print();

            }
        );
    }

});


// =========================================================
// RELAÇÃO DE PRODUTOS
// =========================================================

function mostrarRelacaoProdutos() {

    const container =
        document.getElementById(
            "relacaoProdutos"
        );


    if (!container) {
        return;
    }


    let produtos = [];


    try {

        const dados =
            localStorage.getItem(
                "produtosShalom"
            );


        if (dados) {

            produtos =
                JSON.parse(dados);
        }


        if (!Array.isArray(produtos)) {
            produtos = [];
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar relação:",
            erro
        );

        produtos = [];
    }


    // =====================================================
    // PESQUISA
    // =====================================================

    const campoPesquisa =
        document.getElementById(
            "pesquisaProduto"
        );


    const pesquisa =
        campoPesquisa
            ? campoPesquisa.value
                .trim()
                .toLowerCase()
            : "";


    if (pesquisa) {

        produtos =
            produtos.filter(
                produto => {

                    const nome =
                        String(
                            produto.nome || ""
                        ).toLowerCase();


                    const observacao =
                        String(
                            produto.observacao || ""
                        ).toLowerCase();


                    return (
                        nome.includes(
                            pesquisa
                        ) ||
                        observacao.includes(
                            pesquisa
                        )
                    );
                }
            );
    }


    // =====================================================
    // NENHUM PRODUTO
    // =====================================================

    if (produtos.length === 0) {

        container.innerHTML = `

            <div class="relacao-vazia">

                <div class="relacao-vazia-icone">
                    📦
                </div>

                <h3>
                    ${
                        pesquisa
                            ? "Produto não encontrado"
                            : "Nenhum produto cadastrado"
                    }
                </h3>

                <p>
                    ${
                        pesquisa
                            ? "Tente pesquisar outro produto."
                            : "Cadastre um produto para ele aparecer aqui."
                    }
                </p>

            </div>

        `;

        return;
    }


    // =====================================================
    // TABELA
    // =====================================================

    const tabela =
        document.createElement(
            "table"
        );


    tabela.className =
        "tabela-relacao-produtos";


    tabela.innerHTML = `

        <thead>

            <tr>

                <th>Produto</th>

                <th>Preço</th>

                <th>Estoque</th>

                <th>Observação</th>

                <th>Situação</th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody =
        tabela.querySelector(
            "tbody"
        );


    produtos.forEach(
        produto => {

            const tr =
                document.createElement(
                    "tr"
                );


            const estoque =
                Number(
                    produto.estoque
                ) || 0;


            let situacao = "";

            let classe = "";


            if (estoque <= 0) {

                situacao =
                    "❌ Sem estoque";

                classe =
                    "situacao-sem-estoque";

            } else if (estoque <= 5) {

                situacao =
                    "⚠️ Estoque baixo";

                classe =
                    "situacao-estoque-baixo";

            } else {

                situacao =
                    "✅ Disponível";

                classe =
                    "situacao-disponivel";
            }


            tr.innerHTML = `

                <td>

                    <strong>
                        ${escaparHTML(
                            produto.nome ||
                            "Produto"
                        )}
                    </strong>

                </td>


                <td>

                    ${formatarMoedaRelacao(
                        produto.preco
                    )}

                </td>


                <td class="quantidade-estoque">

                    ${estoque}

                </td>


                <td>

                    ${escaparHTML(
                        produto.observacao ||
                        "-"
                    )}

                </td>


                <td class="${classe}">

                    ${situacao}

                </td>

            `;


            tbody.appendChild(
                tr
            );
        }
    );


    container.innerHTML = "";

    container.appendChild(
        tabela
    );
}


// =========================================================
// FORMATAR MOEDA
// =========================================================

function formatarMoedaRelacao(
    valor
) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// =========================================================
// SEGURANÇA HTML
// =========================================================

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}