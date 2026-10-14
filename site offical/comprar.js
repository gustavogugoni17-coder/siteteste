(() => {
"use strict";

const PRODUTOS = [
  {id:"caixa", nome:"Caixa de Papelão", preco:10.90, imagem:"caixa de papelao.webp", observacao:"Caixa resistente para diversos produtos."},
  {id:"sacola", nome:"Sacola Kraft", preco:10.50, imagem:null, observacao:"Sacola kraft para lojas e presentes."},
  {id:"delivery", nome:"Embalagem Delivery", preco:10.00, imagem:"emblagens.jpg", observacao:"Ideal para restaurantes e lanchonetes."},
  {id:"copo", nome:"Copo Descartável", preco:10.90, imagem:"copos png..webp", observacao:"Para festas, eventos e comércio."}
];

const produtosEl = document.getElementById("produtos");
const listaResumo = document.getElementById("listaResumo");
const totalEl = document.getElementById("total");
const continuar = document.getElementById("continuar");

function moeda(v) {
  return Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
}

function renderProdutos() {
  produtosEl.innerHTML = PRODUTOS.map(p => `
    <article class="produto">
      ${p.imagem ? `<img src="${p.imagem}" alt="${p.nome}">` : `<div class="emoji">🛍️</div>`}
      <h3>${p.nome}</h3>
      <p>${p.observacao}</p>
      <span class="preco">R$ ${moeda(p.preco)}</span>
      <label class="selecionar">
        <input type="checkbox" class="produto-selecao" data-id="${p.id}">
        Selecionar
      </label>
      <div class="linha">
        <label for="qtd-${p.id}">Quantidade</label>
        <input id="qtd-${p.id}" class="quantidade" type="number" min="0" step="1" value="0" inputmode="numeric">
      </div>
    </article>
  `).join("");

  produtosEl.querySelectorAll("input").forEach(el => el.addEventListener("input", atualizarResumo));
  produtosEl.querySelectorAll(".produto-selecao").forEach(el => el.addEventListener("change", atualizarResumo));
}

function obterCarrinho() {
  return PRODUTOS.map(p => {
    const selecionado = document.querySelector(`.produto-selecao[data-id="${p.id}"]`)?.checked;
    const quantidade = Math.max(0, parseInt(document.getElementById(`qtd-${p.id}`)?.value,10) || 0);
    return selecionado && quantidade > 0 ? {
      id:p.id,nome:p.nome,preco:p.preco,quantidade,
      subtotal:Number((p.preco * quantidade).toFixed(2))
    } : null;
  }).filter(Boolean);
}

function atualizarResumo() {
  const carrinho = obterCarrinho();
  const total = carrinho.reduce((s,p) => s + p.subtotal, 0);

  listaResumo.innerHTML = carrinho.length
    ? carrinho.map(p => `<div class="item-resumo"><span>${p.quantidade}x ${p.nome}</span><strong>R$ ${moeda(p.subtotal)}</strong></div>`).join("")
    : `<p class="vazio">Nenhum produto selecionado.</p>`;

  totalEl.textContent = moeda(total);
}

continuar.addEventListener("click", () => {
  const carrinho = obterCarrinho();
  if (!carrinho.length) {
    alert("Selecione pelo menos um produto e informe a quantidade.");
    return;
  }
  localStorage.setItem("carrinhoCompra", JSON.stringify(carrinho));
  window.location.href = "finalizacao.html";
});

renderProdutos();
atualizarResumo();
})();
