
// ==========================================
// SISTEMA DE MOEDAS NORMAIS
// ==========================================

let moedas = 0;

let ganho = 1;
let precoUpgrade = 10;

let ganhoSegundo = 1;
let precoUpgradesegundo = 20;

let botao = document.getElementById("botaomoeda");
let contador = document.getElementById("moedas");

let ganhoTexto = document.getElementById("ganhoTexto");
let ganhoSegundoTexto = document.getElementById("ganhoSegundoTexto");

function atualizarMoedas() {
    contador.textContent = moedas;
    ganhoTexto.textContent = ganho;
    ganhoSegundoTexto.textContent = ganhoSegundo;
}

botao.addEventListener("click", function() {
    moedas += ganho;
    atualizarMoedas();
});

// Ganhar moedas a cada segundo

setInterval(function() {
    moedas += ganhoSegundo;
    atualizarMoedas();
}, 1000);


// ==========================================
// UPGRADES NORMAIS
// ==========================================

let upgrade = document.getElementById("upgrade");

upgrade.addEventListener("click", function() {

    if (moedas >= precoUpgrade) {

        moedas -= precoUpgrade;
        ganho += 1;
        precoUpgrade += 10;

        upgrade.textContent = "Upgrade de clique - " + precoUpgrade + " moedas";

        atualizarMoedas();

    } else {
        alert("Moedas insuficientes!");
    }

});


let upgradesegundo = document.getElementById("upgradesegundo");

upgradesegundo.addEventListener("click", function() {

    if (moedas >= precoUpgradesegundo) {

        moedas -= precoUpgradesegundo;
        ganhoSegundo += 1;
        precoUpgradesegundo += 20;

        upgradesegundo.textContent = "Upgrade por segundo - " + precoUpgradesegundo + " moedas";

        atualizarMoedas();

    } else {
        alert("Moedas insuficientes!");
    }

});


// ==========================================
// SISTEMA VIP
// ==========================================

let vip = false;

let botaoVip = document.getElementById("botaoVip");
let upgradesVip = document.getElementById("upgradesVip");
let statusVip = document.getElementById("statusVip");

function ativarVip() {

    vip = true;

    upgradesVip.style.display = "block";
    statusVip.textContent = "👑 Você é VIP!";
    botaoVip.style.display = "none";

}

botaoVip.addEventListener("click", function() {
    alert("O VIP só pode ser liberado por código ou pelo administrador!");
});


// Upgrades VIP

let precoUpgradeVip = 100;
let precoUpgradeVipSegundo = 150;

let upgradeVip = document.getElementById("upgradeVip");

upgradeVip.addEventListener("click", function() {

    if (!vip) {
        alert("Você precisa ser VIP!");
        return;
    }

    if (moedas >= precoUpgradeVip) {

        moedas -= precoUpgradeVip;
        ganho += 10;
        precoUpgradeVip += 100;

        upgradeVip.textContent = "Upgrade VIP - " + precoUpgradeVip + " moedas";

        atualizarMoedas();

    } else {
        alert("Moedas insuficientes!");
    }

});


let upgradeVipSegundo = document.getElementById("upgradeVipSegundo");

upgradeVipSegundo.addEventListener("click", function() {

    if (!vip) {
        alert("Você precisa ser VIP!");
        return;
    }

    if (moedas >= precoUpgradeVipSegundo) {

        moedas -= precoUpgradeVipSegundo;
        ganhoSegundo += 10;
        precoUpgradeVipSegundo += 150;

        upgradeVipSegundo.textContent = "Upgrade VIP - " + precoUpgradeVipSegundo + " moedas";

        atualizarMoedas();

    } else {
        alert("Moedas insuficientes!");
    }

});


// ==========================================
// CÓDIGOS VIP
// ==========================================

let codigosVip = ["NIKO2026", "VIPGRATIS", "MEGAVIP"];
let codigosUsados = [];

let codigoInput = document.getElementById("codigoInput");
let resgatarCodigo = document.getElementById("resgatarCodigo");
let mensagemCodigo = document.getElementById("mensagemCodigo");

resgatarCodigo.addEventListener("click", function() {

    let codigo = codigoInput.value.toUpperCase().trim();

    if (codigosVip.includes(codigo) && !codigosUsados.includes(codigo)) {

        ativarVip();

        codigosUsados.push(codigo);

        mensagemCodigo.textContent = "VIP ativado com sucesso!";

    } else if (codigosUsados.includes(codigo)) {

        mensagemCodigo.textContent = "Esse código já foi utilizado!";

    } else {

        mensagemCodigo.textContent = "Código inválido!";

    }

});


// ==========================================
// SISTEMA DE GOLDS E LOJA
// ==========================================

// Os Golds são diferentes das moedas normais.

let golds = 0;

// Produtos cadastrados na loja.
let produtos = [];

// Histórico de compras.
let historico = [];


// Elementos da loja

let saldoGolds = document.getElementById("saldoGolds");
let produtosLoja = document.getElementById("produtosLoja");
let historicoCompras = document.getElementById("historicoCompras");

function atualizarGolds() {
    saldoGolds.textContent = golds;
}


// Evita que textos cadastrados sejam interpretados como HTML.

function escaparHTML(texto) {

    return String(texto).replace(/[&<>"']/g, function(letra) {

        let caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[letra];

    });

}


// Mostrar produtos disponíveis para os jogadores.

function mostrarProdutos() {

    produtosLoja.innerHTML = "";

    let disponiveis = produtos.filter(function(produto) {
        return produto.ativo && (produto.estoque === null || produto.estoque > 0);
    });

    if (disponiveis.length === 0) {

        produtosLoja.innerHTML = "<p>Nenhum produto disponível no momento.</p>";
        return;

    }

    disponiveis.forEach(function(produto) {

        let card = document.createElement("div");

        card.className = "produto";

        let estoqueTexto = produto.estoque === null
            ? "Estoque ilimitado"
            : "Estoque: " + produto.estoque;

        card.innerHTML = `
            <h3>${escaparHTML(produto.nome)}</h3>

            <p>${escaparHTML(produto.descricao)}</p>

            <p>Preço: <strong>${produto.preco} Golds 🪙</strong></p>

            <p>${estoqueTexto}</p>

            <button>Comprar</button>
        `;

        let botaoComprar = card.querySelector("button");

        botaoComprar.addEventListener("click", function() {
            comprarProduto(produto.id);
        });

        produtosLoja.appendChild(card);

    });

}


// Comprar produto.

function comprarProduto(id) {

    let produto = produtos.find(function(item) {
        return item.id === id;
    });

    if (!produto || !produto.ativo) {
        alert("Produto indisponível!");
        return;
    }

    if (produto.estoque !== null && produto.estoque <= 0) {
        alert("Produto esgotado!");
        return;
    }

    if (golds < produto.preco) {
        alert("Você não tem Golds suficientes!");
        return;
    }

    let confirmar = confirm(
        "Deseja comprar " + produto.nome + " por " + produto.preco + " Golds?"
    );

    if (!confirmar) {
        return;
    }

    // Desconta os Golds.

    golds -= produto.preco;

    // Diminui o estoque, caso seja limitado.

    if (produto.estoque !== null) {
        produto.estoque--;
    }

    // Registra a compra.

    historico.push({
        nome: produto.nome,
        preco: produto.preco,
        data: new Date().toLocaleString("pt-BR")
    });

    atualizarGolds();
    mostrarProdutos();
    mostrarHistorico();
    mostrarProdutosAdmin();

}


// Mostrar histórico de compras.

function mostrarHistorico() {

    historicoCompras.innerHTML = "";

    if (historico.length === 0) {

        historicoCompras.innerHTML = "<p>Nenhuma compra realizada.</p>";
        return;

    }

    historico.slice().reverse().forEach(function(compra) {

        let item = document.createElement("p");

        item.textContent =
            compra.nome + " - " +
            compra.preco + " Golds - " +
            compra.data;

        historicoCompras.appendChild(item);

    });

}


// ==========================================
// PAINEL ADMINISTRATIVO
// ==========================================


// Adicionar moedas normais.

let adicionarMoedas = document.getElementById("adicionarMoedas");

adicionarMoedas.addEventListener("click", function() {

    let quantidade = Number(
        document.getElementById("quantidadeMoedas").value
    );

    if (quantidade > 0 && Number.isSafeInteger(quantidade)) {

        moedas += quantidade;

        atualizarMoedas();

        document.getElementById("quantidadeMoedas").value = "";

    } else {
        alert("Digite uma quantidade válida!");
    }

});


// Adicionar Golds.

let adicionarGolds = document.getElementById("adicionarGolds");

adicionarGolds.addEventListener("click", function() {

    let quantidade = Number(
        document.getElementById("quantidadeGolds").value
    );

    if (quantidade > 0 && Number.isSafeInteger(quantidade)) {

        golds += quantidade;

        atualizarGolds();

        document.getElementById("quantidadeGolds").value = "";

        alert(quantidade + " Golds adicionados!");

    } else {

        alert("Digite uma quantidade válida!");

    }

});


// ==========================================
// CADASTRAR PRODUTOS
// ==========================================

let cadastrarProduto = document.getElementById("cadastrarProduto");

cadastrarProduto.addEventListener("click", function() {

    let nome = document.getElementById("nomeProduto").value.trim();

    let descricao = document.getElementById("descricaoProduto").value.trim();

    let preco = Number(document.getElementById("precoProduto").value);

    let estoqueCampo = document.getElementById("estoqueProduto").value.trim();

    let estoque = estoqueCampo === "" ? null : Number(estoqueCampo);

    if (nome === "") {
        alert("Digite o nome do produto!");
        return;
    }

    if (!Number.isSafeInteger(preco) || preco <= 0) {
        alert("Digite um preço válido em Golds!");
        return;
    }

    if (
        estoque !== null &&
        (!Number.isSafeInteger(estoque) || estoque < 0)
    ) {
        alert("Digite um estoque válido!");
        return;
    }

    let produto = {

        id: Date.now() + Math.random(),

        nome: nome,

        descricao: descricao,

        preco: preco,

        estoque: estoque,

        ativo: true

    };

    produtos.push(produto);

    mostrarProdutos();
    mostrarProdutosAdmin();

    document.getElementById("nomeProduto").value = "";
    document.getElementById("descricaoProduto").value = "";
    document.getElementById("precoProduto").value = "";
    document.getElementById("estoqueProduto").value = "";

    document.getElementById("mensagemProduto").textContent =
        "Produto cadastrado com sucesso!";

});


// ==========================================
// GERENCIAR PRODUTOS NO PAINEL ADM
// ==========================================

let gerenciarProdutos = document.getElementById("gerenciarProdutos");

function mostrarProdutosAdmin() {

    gerenciarProdutos.innerHTML = "";

    if (produtos.length === 0) {

        gerenciarProdutos.innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;

    }

    produtos.forEach(function(produto) {

        let item = document.createElement("div");

        item.className = "itemAdmin";

        let estoqueTexto = produto.estoque === null
            ? "Ilimitado"
            : produto.estoque;

        item.innerHTML = `
            <h4>${escaparHTML(produto.nome)}</h4>

            <p>Preço: ${produto.preco} Golds</p>

            <p>Estoque: ${estoqueTexto}</p>

            <p>Status: ${produto.ativo ? "Ativo" : "Inativo"}</p>

            <button class="alternar">Ativar/Desativar</button>

            <button class="excluir">Excluir</button>
        `;

        item.querySelector(".alternar").addEventListener("click", function() {

            produto.ativo = !produto.ativo;

            mostrarProdutos();
            mostrarProdutosAdmin();

        });

        item.querySelector(".excluir").addEventListener("click", function() {

            let confirmar = confirm(
                "Deseja realmente excluir " + produto.nome + "?"
            );

            if (confirmar) {

                produtos = produtos.filter(function(item) {
                    return item.id !== produto.id;
                });

                mostrarProdutos();
                mostrarProdutosAdmin();

            }

        });

        gerenciarProdutos.appendChild(item);

    });

}


// ==========================================
// CRIAR CÓDIGOS VIP PELO ADM
// ==========================================

let criarCodigo = document.getElementById("criarCodigo");

criarCodigo.addEventListener("click", function() {

    let codigo = document.getElementById("novoCodigo").value
        .trim()
        .toUpperCase();

    if (codigo !== "" && !codigosVip.includes(codigo)) {

        codigosVip.push(codigo);

        document.getElementById("listaCodigos").textContent =
            "Códigos: " + codigosVip.join(", ");

        document.getElementById("novoCodigo").value = "";

    } else {

        alert("Código vazio ou já existente!");

    }

});


// ==========================================
// UPGRADES GRATUITOS PELO ADM
// ==========================================

let upgradeGratisClique = document.getElementById("upgradeGratisClique");

upgradeGratisClique.addEventListener("click", function() {

    ganho += 10;

    atualizarMoedas();

});


let upgradeGratisSegundo = document.getElementById("upgradeGratisSegundo");

upgradeGratisSegundo.addEventListener("click", function() {

    ganhoSegundo += 10;

    atualizarMoedas();

});


// ==========================================
// ATIVAR VIP PELO ADM
// ==========================================

let ativarVipAdmin = document.getElementById("ativarVipAdmin");

ativarVipAdmin.addEventListener("click", function() {

    ativarVip();

});


// ==========================================
// LOGIN ADMINISTRATIVO
// ==========================================

let senhaCorreta = "34666506k";

let entrarAdmin = document.getElementById("entrarAdmin");

let senhaAdmin = document.getElementById("senhaAdmin");

let mensagemLogin = document.getElementById("mensagemLogin");

entrarAdmin.addEventListener("click", function() {

    if (senhaAdmin.value === senhaCorreta) {

        document.getElementById("painelAdmin").style.display = "block";

        document.getElementById("loginAdmin").style.display = "none";

        mensagemLogin.textContent = "";

    } else {

        mensagemLogin.textContent = "Senha incorreta!";

    }

});


// Sair do painel ADM.

let sairAdmin = document.getElementById("sairAdmin");

sairAdmin.addEventListener("click", function() {

    document.getElementById("painelAdmin").style.display = "none";

    document.getElementById("loginAdmin").style.display = "block";

    senhaAdmin.value = "";

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarMoedas();

atualizarGolds();

mostrarProdutos();

mostrarHistorico();

mostrarProdutosAdmin();
