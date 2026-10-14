// ==========================================
// ADMIN - PEDIDOS DOS CLIENTES
// SITE
// ==========================================

(() => {

    "use strict";

    // ==========================================
    // PROTEÇÃO DO ADMINISTRADOR
    // ==========================================

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (tipoUsuario !== "admin") {
        window.location.href = "login.html";
        return;
    }


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const lista = document.getElementById("listaPedidos");
    const atualizar = document.getElementById("atualizar");
    const limpar = document.getElementById("limpar");


    // ==========================================
    // VERIFICAÇÃO
    // ==========================================

    if (!lista) {
        console.error("Elemento #listaPedidos não encontrado.");
        return;
    }


    // ==========================================
    // MOEDA
    // ==========================================

    function moeda(valor) {

        const numero = Number(valor) || 0;

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }


    // ==========================================
    // SEGURANÇA
    // ==========================================

    function escapar(valor) {

        return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[caractere]));
    }


    // ==========================================
    // PEGAR PEDIDOS
    // ==========================================

    function pegarPedidos() {

        try {

            const dados = JSON.parse(
                localStorage.getItem("pedidosShalom") || "[]"
            );

            return Array.isArray(dados) ? dados : [];

        } catch (erro) {

            console.error("Erro ao carregar pedidos:", erro);

            return [];
        }
    }


    // ==========================================
    // DATA
    // ==========================================

    function formatarData(data) {

        if (!data) {
            return "Data não informada";
        }

        const dataConvertida = new Date(data);

        if (Number.isNaN(dataConvertida.getTime())) {
            return escapar(data);
        }

        return dataConvertida.toLocaleString("pt-BR");
    }


    // ==========================================
    // ENDEREÇO
    // ==========================================

    function mostrarEndereco(endereco) {

        if (!endereco) {
            return "<p>Endereço não informado.</p>";
        }


        // Caso o endereço esteja salvo como texto
        if (typeof endereco === "string") {

            return `
                <p>
                    ${escapar(endereco)}
                </p>
            `;
        }


        // Caso esteja salvo como objeto
        const rua = endereco.rua || "";
        const numero = endereco.numero || "";
        const complemento = endereco.complemento || "";
        const bairro = endereco.bairro || "";
        const cidade = endereco.cidade || "";
        const cep = endereco.cep || "";


        return `
            ${
                rua || numero
                    ? `<p>
                        ${escapar(rua)}
                        ${numero ? `, nº ${escapar(numero)}` : ""}
                    </p>`
                    : ""
            }

            ${
                complemento
                    ? `<p>
                        <strong>Complemento:</strong>
                        ${escapar(complemento)}
                    </p>`
                    : ""
            }

            ${
                bairro
                    ? `<p>
                        <strong>Bairro:</strong>
                        ${escapar(bairro)}
                    </p>`
                    : ""
            }

            ${
                cidade
                    ? `<p>
                        <strong>Cidade:</strong>
                        ${escapar(cidade)}
                    </p>`
                    : ""
            }

            ${
                cep
                    ? `<p>
                        <strong>CEP:</strong>
                        ${escapar(cep)}
                    </p>`
                    : ""
            }

            ${
                !rua &&
                !numero &&
                !complemento &&
                !bairro &&
                !cidade &&
                !cep
                    ? "<p>Endereço não informado.</p>"
                    : ""
            }
        `;
    }


    // ==========================================
    // PRODUTOS
    // ==========================================

    function mostrarProdutos(produtos) {

        if (!Array.isArray(produtos) || produtos.length === 0) {

            return `
                <p>
                    Nenhum produto informado.
                </p>
            `;
        }


        return produtos.map(item => {

            const quantidade =
                Number(item.quantidade) || 0;

            const preco =
                Number(item.preco) || 0;

            const subtotal =
                Number(item.subtotal) || (preco * quantidade);


            return `
                <div class="produto-linha">

                    <span>
                        ${escapar(quantidade)}x
                        ${escapar(item.nome || "Produto")}
                    </span>

                    <strong>
                        ${moeda(subtotal)}
                    </strong>

                </div>
            `;

        }).join("");
    }


    // ==========================================
    // CARREGAR PEDIDOS
    // ==========================================

    function carregarPedidos() {

        let pedidos = pegarPedidos();


        // Ordena do mais recente para o mais antigo
        pedidos.sort((a, b) => {

            const dataA =
                Number(a.id) || 0;

            const dataB =
                Number(b.id) || 0;

            return dataB - dataA;
        });


        // Nenhum pedido
        if (pedidos.length === 0) {

            lista.innerHTML = `
                <div class="vazio">

                    <h3>📦 Nenhum pedido registrado</h3>

                    <p>
                        Quando um cliente realizar um pedido,
                        ele aparecerá aqui.
                    </p>

                </div>
            `;

            return;
        }


        // Mostra os pedidos
        lista.innerHTML = pedidos.map((pedido, index) => {

            const produtos =
                Array.isArray(pedido.produtos)
                    ? pedido.produtos
                    : [];


            const total =
                Number(pedido.total) || 0;


            const nome =
                pedido.nome ||
                pedido.nomeCliente ||
                "Cliente";


            const email =
                pedido.email ||
                pedido.emailCliente ||
                "";


            const telefone =
                pedido.telefone ||
                "";


            const pagamento =
                pedido.pagamento ||
                "Não informado";


            const status =
                pedido.status ||
                "Pendente";


            const observacao =
                pedido.observacao ||
                "";


            return `
                <article class="pedido">


                    <!-- CABEÇALHO -->

                    <div class="pedido-topo">

                        <div>

                            <h3>
                                📦 Pedido #${escapar(
                                    pedido.id || index + 1
                                )}
                            </h3>

                            <p>
                                <strong>
                                    ${escapar(nome)}
                                </strong>
                            </p>

                        </div>


                        <span class="status">
                            ${escapar(status)}
                        </span>

                    </div>


                    <!-- DADOS DO CLIENTE -->

                    <div class="grid">


                        <div class="bloco">

                            <h4>
                                👤 Cliente
                            </h4>

                            <p>
                                <strong>Nome:</strong>
                                ${escapar(nome)}
                            </p>


                            ${
                                email
                                    ? `
                                    <p>
                                        <strong>E-mail:</strong>
                                        ${escapar(email)}
                                    </p>
                                    `
                                    : ""
                            }


                            ${
                                telefone
                                    ? `
                                    <p>
                                        <strong>Telefone:</strong>
                                        ${escapar(telefone)}
                                    </p>
                                    `
                                    : ""
                            }


                            <p>
                                <strong>Data:</strong>
                                ${formatarData(pedido.data)}
                            </p>


                            <p>
                                <strong>Pagamento:</strong>
                                ${escapar(pagamento)}
                            </p>

                        </div>


                        <!-- ENDEREÇO -->

                        <div class="bloco">

                            <h4>
                                📍 Endereço de entrega
                            </h4>

                            ${mostrarEndereco(
                                pedido.endereco
                            )}

                        </div>

                    </div>


                    <!-- PRODUTOS -->

                    <div
                        class="bloco"
                        style="margin-top:18px"
                    >

                        <h4>
                            🛒 Produtos
                        </h4>


                        ${mostrarProdutos(produtos)}


                        <div class="total">

                            Total:

                            <strong>
                                ${moeda(total)}
                            </strong>

                        </div>

                    </div>


                    <!-- OBSERVAÇÃO -->

                    ${
                        observacao
                            ? `
                                <div
                                    class="bloco"
                                    style="margin-top:18px"
                                >

                                    <h4>
                                        📝 Observação
                                    </h4>

                                    <div class="observacao">
                                        ${escapar(observacao)}
                                    </div>

                                </div>
                            `
                            : ""
                    }


                </article>
            `;

        }).join("");
    }


    // ==========================================
    // BOTÃO ATUALIZAR
    // ==========================================

    if (atualizar) {

        atualizar.addEventListener(
            "click",
            carregarPedidos
        );

    }


    // ==========================================
    // LIMPAR PEDIDOS
    // ==========================================

    if (limpar) {

        limpar.addEventListener("click", () => {

            const pedidos = pegarPedidos();


            if (pedidos.length === 0) {

                alert("Não existem pedidos para apagar.");

                return;
            }


            const confirmar = confirm(
                "Tem certeza que deseja apagar TODOS os pedidos deste navegador?"
            );


            if (!confirmar) {
                return;
            }


            localStorage.removeItem(
                "pedidosShalom"
            );


            carregarPedidos();

        });

    }


    // ==========================================
    // INICIAR
    // ==========================================

    carregarPedidos();


})();