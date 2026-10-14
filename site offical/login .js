// ==========================================
// LOGIN.JS
// LOGIN DE ADMINISTRADOR E CLIENTE
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const loginForm = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");

    // ==========================================
    // VERIFICAR FORMULÁRIO
    // ==========================================

    if (!loginForm) {
        console.error("ERRO: #loginForm não encontrado.");
        return;
    }

    // ==========================================
    // ENVIO DO LOGIN
    // ==========================================

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = campoEmail.value.trim().toLowerCase();
        const senha = campoSenha.value.trim();

        // ==========================================
        // LIMPAR MENSAGEM
        // ==========================================

        mensagem.textContent = "";
        mensagem.style.color = "";

        // ==========================================
        // VALIDAR CAMPOS
        // ==========================================

        if (!email || !senha) {

            mensagem.textContent =
                "Digite o e-mail e a senha.";

            mensagem.style.color = "red";

            return;
        }

        // ==========================================
        // LOGIN ADMIN
        // ==========================================

        const ADMIN_EMAIL = "admin@shalom.com";
        const ADMIN_SENHA = "123456";

        if (
            email === ADMIN_EMAIL &&
            senha === ADMIN_SENHA
        ) {

            localStorage.setItem(
                "tipoUsuario",
                "admin"
            );

            localStorage.setItem(
                "usuarioLogado",
                email
            );

            localStorage.setItem(
                "nomeUsuario",
                "Administrador"
            );

            // Limpa dados antigos do cliente
            localStorage.removeItem("usuarioNome");
            localStorage.removeItem("clienteNome");

            // Vai para o painel
            window.location.href = "admin.html";

            return;
        }

        // ==========================================
        // CARREGAR CLIENTES
        // ==========================================

        let usuarios = [];

        try {

            const dados =
                localStorage.getItem("usuariosShalom");

            if (dados) {
                usuarios = JSON.parse(dados);
            }

            if (!Array.isArray(usuarios)) {
                usuarios = [];
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar usuariosShalom:",
                erro
            );

            usuarios = [];
        }

        // ==========================================
        // PROCURAR CLIENTE
        // ==========================================

        const cliente = usuarios.find((usuario) => {

            if (!usuario) {
                return false;
            }

            const emailCliente =
                String(usuario.email || "")
                    .trim()
                    .toLowerCase();

            const senhaCliente =
                String(usuario.senha || "");

            return (
                emailCliente === email &&
                senhaCliente === senha
            );
        });

        // ==========================================
        // LOGIN DO CLIENTE
        // ==========================================

        if (cliente) {

            const nomeCliente =
                cliente.nome || "Cliente";

            localStorage.setItem(
                "tipoUsuario",
                "cliente"
            );

            localStorage.setItem(
                "usuarioLogado",
                cliente.email
            );

            localStorage.setItem(
                "usuarioNome",
                nomeCliente
            );

            // Compatibilidade
            localStorage.setItem(
                "clienteNome",
                nomeCliente
            );

            // Remove dados do admin
            localStorage.removeItem(
                "nomeUsuario"
            );

            // Vai para o site
            window.location.href = "index.html";

            return;
        }

        // ==========================================
        // LOGIN INCORRETO
        // ==========================================

        mensagem.textContent =
            "E-mail ou senha incorretos.";

        mensagem.style.color = "red";

        campoSenha.value = "";
        campoSenha.focus();

    });

});