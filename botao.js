
// ==========================================
// SISTEMA DE MOEDAS NORMAIS
// ==========================================
let intervaloTexto = document.getElementById("intervaloTexto");
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

    let bonus = calcularBonusItens();

    contador.textContent = moedas;

    ganhoTexto.textContent = ganho + bonus.clique;

    ganhoSegundoTexto.textContent = ganhoSegundo + bonus.ciclo;

    intervaloTexto.textContent =
        (bonus.intervalo / 1000).toFixed(2) + " segundos";
}

botao.addEventListener("click", function() {
    moedas += ganho;
    atualizarMoedas();
});

// Ganhar moedas a cada segundo

let ultimoTick = Date.now();
let acumuladorTempo = 0;

setInterval(function() {

    let agora = Date.now();

    acumuladorTempo += agora - ultimoTick;

    ultimoTick = agora;

    let bonus = calcularBonusItens();

    while (acumuladorTempo >= bonus.intervalo) {

        moedas += ganhoSegundo + bonus.ciclo;

        acumuladorTempo -= bonus.intervalo;
    }

    atualizarMoedas();

}, 100);


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

let codigosVip = ["Teste2026", "VIPGRATIS", "MEGAVIP"];
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
// SISTEMA DE BAÚS E INVENTÁRIO
// ==========================================

// Itens disponíveis

let todosItens = [

    // CATEGORIA: CLIQUE

    {
        id: "luva1",
        nome: "Luva de Poder",
        categoria: "clique",
        raridade: "Comum",
        descricao: "+5 moedas por clique",
        bonusClique: 5,
        bonusCiclo: 0,
        intervalo: 0,
        conversao: 100
    },

    {
        id: "luva2",
        nome: "Luva Dourada",
        categoria: "clique",
        raridade: "Raro",
        descricao: "+15 moedas por clique",
        bonusClique: 15,
        bonusCiclo: 0,
        intervalo: 0,
        conversao: 300
    },

    {
        id: "luva3",
        nome: "Luva Real",
        categoria: "clique",
        raridade: "Épico",
        descricao: "+40 moedas por clique",
        bonusClique: 40,
        bonusCiclo: 0,
        intervalo: 0,
        conversao: 800
    },

    // CATEGORIA: INTERVALO

    {
        id: "relogio1",
        nome: "Relógio Preciso",
        categoria: "intervalo",
        raridade: "Raro",
        descricao: "Reduz o intervalo em 0,2 segundo",
        bonusClique: 0,
        bonusCiclo: 0,
        intervalo: -200,
        conversao: 300
    },

    {
        id: "relogio2",
        nome: "Relógio de Cronos",
        categoria: "intervalo",
        raridade: "Épico",
        descricao: "Reduz o intervalo em 0,4 segundo",
        bonusClique: 0,
        bonusCiclo: 0,
        intervalo: -400,
        conversao: 800
    },

    {
        id: "ampulheta",
        nome: "Ampulheta Mágica",
        categoria: "intervalo",
        raridade: "Lendário",
        descricao: "+15 moedas por ciclo, mas aumenta o intervalo em 1 segundo",
        bonusClique: 0,
        bonusCiclo: 15,
        intervalo: 1000,
        conversao: 1500
    },

    // CATEGORIA: PRODUÇÃO

    {
        id: "gerador1",
        nome: "Gerador Básico",
        categoria: "producao",
        raridade: "Comum",
        descricao: "+5 moedas por ciclo",
        bonusClique: 0,
        bonusCiclo: 5,
        intervalo: 0,
        conversao: 100
    },

    {
        id: "gerador2",
        nome: "Gerador Avançado",
        categoria: "producao",
        raridade: "Épico",
        descricao: "+20 moedas por ciclo",
        bonusClique: 0,
        bonusCiclo: 20,
        intervalo: 0,
        conversao: 800
    }

];

// Inventário e equipamentos

let inventarioItens = [];

let itensEquipados = {
    clique: null,
    intervalo: null,
    producao: null
};


// ==========================================
// CALCULAR ATRIBUTOS DOS EQUIPAMENTOS
// ==========================================

function calcularBonusItens() {

    let bonus = {
        clique: 0,
        ciclo: 0,
        intervalo: 1000
    };

    Object.values(itensEquipados).forEach(function(id) {

        if (!id) return;

        let item = todosItens.find(function(i) {
            return i.id === id;
        });

        if (!item) return;

        bonus.clique += item.bonusClique;
        bonus.ciclo += item.bonusCiclo;
        bonus.intervalo += item.intervalo;

    });

    // Impede intervalos menores que 0,25 segundo.

    bonus.intervalo = Math.max(250, bonus.intervalo);

    return bonus;
}


// ==========================================
// PROBABILIDADES DOS BAÚS
// ==========================================

let probabilidadesBaus = {

    madeira: {
        Comum: 75,
        Raro: 22,
        Épico: 3,
        Lendário: 0
    },

    prata: {
        Comum: 35,
        Raro: 45,
        Épico: 18,
        Lendário: 2
    },

    ouro: {
        Comum: 10,
        Raro: 30,
        Épico: 45,
        Lendário: 15
    }

};


// ==========================================
// SORTEAR ITEM
// ==========================================

function sortearItem(tipo) {

    let probabilidades = probabilidadesBaus[tipo];

    let sorteio = Math.random() * 100;

    let acumulado = 0;

    let raridadeEscolhida;

    for (let raridade in probabilidades) {

        acumulado += probabilidades[raridade];

        if (sorteio < acumulado) {

            raridadeEscolhida = raridade;

            break;
        }

    }

    let disponiveis = todosItens.filter(function(item) {

        return item.raridade === raridadeEscolhida;

    });

    return disponiveis[
        Math.floor(Math.random() * disponiveis.length)
    ];
}


// ==========================================
// ABRIR BAÚ
// ==========================================

function abrirBau(tipo, moeda) {

    let precos = {

        madeira: {
            moedas: 500,
            golds: 10
        },

        prata: {
            moedas: 2500,
            golds: 40
        },

        ouro: {
            moedas: 10000,
            golds: 150
        }

    };

    let preco = precos[tipo][moeda];

    if (moeda === "moedas" && moedas < preco) {

        alert("Moedas insuficientes!");

        return;
    }

    if (moeda === "golds" && golds < preco) {

        alert("Golds insuficientes!");

        return;
    }

    if (moeda === "moedas") {

        moedas -= preco;

    } else {

        golds -= preco;

    }

    let item = sortearItem(tipo);

    // Item repetido vira moedas.

    if (inventarioItens.includes(item.id)) {

        moedas += item.conversao;

        document.getElementById("resultadoBau").textContent =
            "🔁 Item repetido! " + item.nome +
            " convertido em " + item.conversao + " moedas!";

    } else {

        inventarioItens.push(item.id);

        document.getElementById("resultadoBau").textContent =
            "🎉 Você encontrou: " + item.nome +
            " (" + item.raridade + ")!";

    }

    atualizarMoedas();
    atualizarGolds();
    mostrarInventario();

}

// ==========================================
// MOSTRAR INVENTÁRIO
// ==========================================

function mostrarInventario() {

    let inventario = document.getElementById("inventarioItens");

    inventario.innerHTML = "";

    if (inventarioItens.length === 0) {

        inventario.innerHTML = "<p>Nenhum item conquistado.</p>";

        mostrarAtributosItens();

        return;
    }

    inventarioItens.forEach(function(id) {

        let item = todosItens.find(function(i) {
            return i.id === id;
        });

        if (!item) return;

        let equipado = itensEquipados[item.categoria] === item.id;

        let card = document.createElement("div");

        card.className = "itemInventario";

        let titulo = document.createElement("h3");
        titulo.textContent = item.nome;

        let raridade = document.createElement("p");
        raridade.textContent = "Raridade: " + item.raridade;

        let descricao = document.createElement("p");
        descricao.textContent = item.descricao;

        let status = document.createElement("p");
        status.textContent = equipado ? "EQUIPADO" : "GUARDADO";
        status.className = equipado ? "equipado" : "";

        card.appendChild(titulo);
        card.appendChild(raridade);
        card.appendChild(descricao);
        card.appendChild(status);

        if (!equipado) {

            let botaoEquipar = document.createElement("button");

            botaoEquipar.textContent = "Equipar";

            botaoEquipar.addEventListener("click", function() {

                equiparItem(item.id);

            });

            card.appendChild(botaoEquipar);

        }

        inventario.appendChild(card);

    });

    mostrarAtributosItens();

}

// ==========================================
// EQUIPAR ITEM
// ==========================================

function equiparItem(id) {

    let item = todosItens.find(function(i) {
        return i.id === id;
    });

    if (!item || !inventarioItens.includes(id)) return;

    // Um item por categoria.
    // O novo substitui o anterior.

    itensEquipados[item.categoria] = item.id;

    atualizarMoedas();

    mostrarInventario();

}

// ==========================================
// MOSTRAR ATRIBUTOS
// ==========================================

function mostrarAtributosItens() {

    let bonus = calcularBonusItens();

    document.getElementById("atributosItens").textContent =
        "Clique: +" + bonus.clique +
        " | Ciclo: +" + bonus.ciclo +
        " | Intervalo: " +
        (bonus.intervalo / 1000).toFixed(2) + " segundos";

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarMoedas();

atualizarGolds();

mostrarProdutos();

mostrarHistorico();

mostrarProdutosAdmin();

mostrarInventario();
