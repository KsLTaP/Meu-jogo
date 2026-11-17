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
    if (ganhoTexto) ganhoTexto.textContent = ganho + bonus.clique;
    if (ganhoSegundoTexto) ganhoSegundoTexto.textContent = ganhoSegundo + bonus.ciclo;
    intervaloTexto.textContent = (bonus.intervalo / 1000).toFixed(2) + " segundos";
}

botao.addEventListener("click", function() {
    let bonus = calcularBonusItens();
    moedas += ganho + bonus.clique;
    atualizarMoedas();
});

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
    } else alert("Moedas insuficientes!");
});

let upgradesegundo = document.getElementById("upgradesegundo");
upgradesegundo.addEventListener("click", function() {
    if (moedas >= precoUpgradesegundo) {
        moedas -= precoUpgradesegundo;
        ganhoSegundo += 1;
        precoUpgradesegundo += 20;
        upgradesegundo.textContent = "Upgrade por segundo - " + precoUpgradesegundo + " moedas";
        atualizarMoedas();
    } else alert("Moedas insuficientes!");
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
    document.getElementById("vipBaus").style.display = "block";
    statusVip.textContent = "👑 Você é VIP!";
    botaoVip.style.display = "none";
}

botaoVip.addEventListener("click", function() {
    alert("O VIP só pode ser liberado por código ou pelo administrador!");
});

let precoUpgradeVip = 100;
let precoUpgradeVipSegundo = 150;
let upgradeVip = document.getElementById("upgradeVip");
upgradeVip.addEventListener("click", function() {
    if (!vip) return alert("Você precisa ser VIP!");
    if (moedas >= precoUpgradeVip) {
        moedas -= precoUpgradeVip;
        ganho += 10;
        precoUpgradeVip += 100;
        upgradeVip.textContent = "Upgrade VIP - " + precoUpgradeVip + " moedas";
        atualizarMoedas();
    } else alert("Moedas insuficientes!");
});

let upgradeVipSegundo = document.getElementById("upgradeVipSegundo");
upgradeVipSegundo.addEventListener("click", function() {
    if (!vip) return alert("Você precisa ser VIP!");
    if (moedas >= precoUpgradeVipSegundo) {
        moedas -= precoUpgradeVipSegundo;
        ganhoSegundo += 10;
        precoUpgradeVipSegundo += 150;
        upgradeVipSegundo.textContent = "Upgrade VIP - " + precoUpgradeVipSegundo + " moedas";
        atualizarMoedas();
    } else alert("Moedas insuficientes!");
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
let golds = 0;
let produtos = [];
let historico = [];
let saldoGolds = document.getElementById("saldoGolds");
let produtosLoja = document.getElementById("produtosLoja");
let historicoCompras = document.getElementById("historicoCompras");

function atualizarGolds() {
    saldoGolds.textContent = golds;
}

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, function(letra) {
        let caracteres = {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};
        return caracteres[letra];
    });
}

function mostrarProdutos() {
    produtosLoja.innerHTML = "";
    let disponiveis = produtos.filter(p => p.ativo && (p.estoque === null || p.estoque > 0));
    if (disponiveis.length === 0) {
        produtosLoja.innerHTML = "<p>Nenhum produto disponível no momento.</p>";
        return;
    }
    disponiveis.forEach(function(produto) {
        let card = document.createElement("div");
        card.className = "produto";
        let estoqueTexto = produto.estoque === null ? "Estoque ilimitado" : "Estoque: " + produto.estoque;
        card.innerHTML = `<h3>${escaparHTML(produto.nome)}</h3><p>${escaparHTML(produto.descricao)}</p><p>Preço: <strong>${produto.preco} Golds 🪙</strong></p><p>${estoqueTexto}</p><button>Comprar</button>`;
        card.querySelector("button").addEventListener("click", () => comprarProduto(produto.id));
        produtosLoja.appendChild(card);
    });
}

function comprarProduto(id) {
    let produto = produtos.find(item => item.id === id);
    if (!produto || !produto.ativo) return alert("Produto indisponível!");
    if (produto.estoque !== null && produto.estoque <= 0) return alert("Produto esgotado!");
    if (golds < produto.preco) return alert("Você não tem Golds suficientes!");
    if (!confirm("Deseja comprar " + produto.nome + " por " + produto.preco + " Golds?")) return;
    golds -= produto.preco;
    if (produto.estoque !== null) produto.estoque--;
    historico.push({nome: produto.nome, preco: produto.preco, data: new Date().toLocaleString("pt-BR")});
    atualizarGolds();
    mostrarProdutos();
    mostrarHistorico();
    mostrarProdutosAdmin();
}

function mostrarHistorico() {
    historicoCompras.innerHTML = "";
    if (historico.length === 0) {
        historicoCompras.innerHTML = "<p>Nenhuma compra realizada.</p>";
        return;
    }
    historico.slice().reverse().forEach(function(compra) {
        let item = document.createElement("p");
        item.textContent = compra.nome + " - " + compra.preco + " Golds - " + compra.data;
        historicoCompras.appendChild(item);
    });
}

// ==========================================
// PAINEL ADMINISTRATIVO
// ==========================================
let adicionarMoedas = document.getElementById("adicionarMoedas");
adicionarMoedas.addEventListener("click", function() {
    let quantidade = Number(document.getElementById("quantidadeMoedas").value);
    if (quantidade > 0 && Number.isSafeInteger(quantidade)) {
        moedas += quantidade;
        atualizarMoedas();
        document.getElementById("quantidadeMoedas").value = "";
    } else alert("Digite uma quantidade válida!");
});

let adicionarGolds = document.getElementById("adicionarGolds");
adicionarGolds.addEventListener("click", function() {
    let quantidade = Number(document.getElementById("quantidadeGolds").value);
    if (quantidade > 0 && Number.isSafeInteger(quantidade)) {
        golds += quantidade;
        atualizarGolds();
        document.getElementById("quantidadeGolds").value = "";
        alert(quantidade + " Golds adicionados!");
    } else alert("Digite uma quantidade válida!");
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

    if (nome === "") return alert("Digite o nome do produto!");
    if (!Number.isSafeInteger(preco) || preco <= 0) return alert("Digite um preço válido em Golds!");
    if (estoque !== null && (!Number.isSafeInteger(estoque) || estoque < 0)) return alert("Digite um estoque válido!");

    produtos.push({id: Date.now() + Math.random(), nome, descricao, preco, estoque, ativo: true});
    mostrarProdutos();
    mostrarProdutosAdmin();
    document.getElementById("nomeProduto").value = "";
    document.getElementById("descricaoProduto").value = "";
    document.getElementById("precoProduto").value = "";
    document.getElementById("estoqueProduto").value = "";
    document.getElementById("mensagemProduto").textContent = "Produto cadastrado com sucesso!";
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
        let estoqueTexto = produto.estoque === null ? "Ilimitado" : produto.estoque;
        item.innerHTML = `<h4>${escaparHTML(produto.nome)}</h4><p>Preço: ${produto.preco} Golds</p><p>Estoque: ${estoqueTexto}</p><p>Status: ${produto.ativo ? "Ativo" : "Inativo"}</p><button class="alternar">Ativar/Desativar</button><button class="excluir">Excluir</button>`;
        item.querySelector(".alternar").addEventListener("click", function() {
            produto.ativo = !produto.ativo;
            mostrarProdutos();
            mostrarProdutosAdmin();
        });
        item.querySelector(".excluir").addEventListener("click", function() {
            if (confirm("Deseja realmente excluir " + produto.nome + "?")) {
                produtos = produtos.filter(p => p.id !== produto.id);
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
    let codigo = document.getElementById("novoCodigo").value.trim().toUpperCase();
    if (codigo !== "" && !codigosVip.includes(codigo)) {
        codigosVip.push(codigo);
        document.getElementById("listaCodigos").textContent = "Códigos: " + codigosVip.join(", ");
        document.getElementById("novoCodigo").value = "";
    } else alert("Código vazio ou já existente!");
});

// ==========================================
// UPGRADES GRATUITOS PELO ADM
// ==========================================
document.getElementById("upgradeGratisClique").addEventListener("click", function() {
    ganho += 10;
    atualizarMoedas();
});
document.getElementById("upgradeGratisSegundo").addEventListener("click", function() {
    ganhoSegundo += 10;
    atualizarMoedas();
});

// ==========================================
// ATIVAR VIP PELO ADM
// ==========================================
document.getElementById("ativarVipAdmin").addEventListener("click", function() {
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
    } else mensagemLogin.textContent = "Senha incorreta!";
});

document.getElementById("sairAdmin").addEventListener("click", function() {
    document.getElementById("painelAdmin").style.display = "none";
    document.getElementById("loginAdmin").style.display = "block";
    senhaAdmin.value = "";
});

// ==========================================
// SISTEMA DE BAÚS E INVENTÁRIO
// ==========================================
let todosItens = [
    {id:"luva1", nome:"Luva de Poder", categoria:"clique", raridade:"Comum", descricao:"+5 moedas por clique", bonusClique:5, bonusCiclo:0, intervalo:0, conversao:100},
    {id:"luva2", nome:"Luva Dourada", categoria:"clique", raridade:"Raro", descricao:"+15 moedas por clique", bonusClique:15, bonusCiclo:0, intervalo:0, conversao:300},
    {id:"luva3", nome:"Luva Real", categoria:"clique", raridade:"Épico", descricao:"+40 moedas por clique", bonusClique:40, bonusCiclo:0, intervalo:0, conversao:800},

    {id:"relogio1", nome:"Relógio Preciso", categoria:"intervalo", raridade:"Raro", descricao:"Reduz o intervalo em 0,2 segundo", bonusClique:0, bonusCiclo:0, intervalo:-200, conversao:300},
    {id:"relogio2", nome:"Relógio de Cronos", categoria:"intervalo", raridade:"Épico", descricao:"Reduz o intervalo em 0,4 segundo", bonusClique:0, bonusCiclo:0, intervalo:-400, conversao:800},
    {id:"ampulheta", nome:"Ampulheta Mágica", categoria:"intervalo", raridade:"Lendário", descricao:"+15 moedas por ciclo, mas aumenta o intervalo em 1 segundo", bonusClique:0, bonusCiclo:15, intervalo:1000, conversao:1500},

    {id:"gerador1", nome:"Gerador Básico", categoria:"producao", raridade:"Comum", descricao:"+5 moedas por ciclo", bonusClique:0, bonusCiclo:5, intervalo:0, conversao:100},
    {id:"gerador2", nome:"Gerador Avançado", categoria:"producao", raridade:"Épico", descricao:"+20 moedas por ciclo", bonusClique:0, bonusCiclo:20, intervalo:0, conversao:800},

    {id:"coroaPrimeiro", nome:"Coroa do Primeiro", categoria:"unico", raridade:"ÚNICO", descricao:"Troféu exclusivo: apenas uma pessoa pode conquistar pelos baús.", bonusClique:500, bonusCiclo:1000, intervalo:-900, conversao:1000000000},

    // Itens exclusivos dos baús VIP
    {id:"luvaCelestial", nome:"Luva Celestial", categoria:"clique", raridade:"VIP", descricao:"+100 moedas por clique", bonusClique:100, bonusCiclo:0, intervalo:0, conversao:5000},
    {id:"luvaDivina", nome:"Luva Divina", categoria:"clique", raridade:"Mítico VIP", descricao:"+250 moedas por clique", bonusClique:250, bonusCiclo:0, intervalo:0, conversao:15000},
    {id:"geradorSolar", nome:"Gerador Solar", categoria:"producao", raridade:"VIP", descricao:"+100 moedas por ciclo", bonusClique:0, bonusCiclo:100, intervalo:0, conversao:5000},
    {id:"nucleoInfinito", nome:"Núcleo Infinito", categoria:"producao", raridade:"Mítico VIP", descricao:"+300 moedas por ciclo", bonusClique:0, bonusCiclo:300, intervalo:0, conversao:20000},
    {id:"relogioCelestial", nome:"Relógio Celestial", categoria:"intervalo", raridade:"VIP", descricao:"Reduz o intervalo em 0,5 segundo", bonusClique:0, bonusCiclo:0, intervalo:-500, conversao:6000},
    {id:"relogioDivino", nome:"Relógio Divino", categoria:"intervalo", raridade:"Mítico VIP", descricao:"Reduz o intervalo em 0,65 segundo", bonusClique:0, bonusCiclo:0, intervalo:-650, conversao:20000}
];

let inventarioItens = [];
let itensEquipados = {clique:null, intervalo:null, producao:null, unico:null};
let coroaDoPrimeiroConquistada = false;

// ==========================================
// ADICIONAR ITENS PELO ADM
// ==========================================
const selecionarItemAdmin = document.getElementById("selecionarItemAdmin");
const quantidadeItemAdmin = document.getElementById("quantidadeItemAdmin");
const adicionarItemAdmin = document.getElementById("adicionarItemAdmin");
const mensagemItemAdmin = document.getElementById("mensagemItemAdmin");

function carregarItensNoAdmin() {
    if (!selecionarItemAdmin) return;
    selecionarItemAdmin.innerHTML = "";
    todosItens.forEach(function(item) {
        const opcao = document.createElement("option");
        opcao.value = item.id;
        opcao.textContent = item.nome + " (" + item.raridade + ")";
        selecionarItemAdmin.appendChild(opcao);
    });
}

if (adicionarItemAdmin) {
    carregarItensNoAdmin();
    adicionarItemAdmin.addEventListener("click", function() {
        const id = selecionarItemAdmin.value;
        const quantidade = Number(quantidadeItemAdmin.value);
        const item = todosItens.find(i => i.id === id);
        if (!item || !Number.isSafeInteger(quantidade) || quantidade < 1 || quantidade > 1000) {
            mensagemItemAdmin.textContent = "Escolha um item e uma quantidade entre 1 e 1000.";
            return;
        }
        for (let i = 0; i < quantidade; i++) inventarioItens.push(item.id);
        if (item.id === "coroaPrimeiro") coroaDoPrimeiroConquistada = true;
        mensagemItemAdmin.textContent = quantidade + "x " + item.nome + " adicionado(s) ao inventário. O ADM pode duplicar itens ÚNICOS.";
        quantidadeItemAdmin.value = "1";
        mostrarInventario();
    });
}

// ==========================================
// CALCULAR ATRIBUTOS DOS EQUIPAMENTOS
// ==========================================
function calcularBonusItens() {
    let bonus = {clique:0, ciclo:0, intervalo:1000};
    Object.values(itensEquipados).forEach(function(id) {
        if (!id) return;
        let item = todosItens.find(i => i.id === id);
        if (!item) return;
        bonus.clique += item.bonusClique;
        bonus.ciclo += item.bonusCiclo;
        bonus.intervalo += item.intervalo;
    });
    bonus.intervalo = Math.max(250, bonus.intervalo);
    return bonus;
}

// ==========================================
// PROBABILIDADES DOS BAÚS NORMAIS
// ==========================================
let probabilidadesBaus = {
    madeira: {Comum:75, Raro:22, Épico:3, Lendário:0},
    prata: {Comum:35, Raro:45, Épico:18, Lendário:2},
    ouro: {Comum:10, Raro:30, Épico:45, Lendário:15}
};

function sortearItem(tipo) {
    const chancesUnico = {madeira:0.01, prata:0.02, ouro:0.03};
    if (!coroaDoPrimeiroConquistada && Math.random() * 100 < chancesUnico[tipo]) {
        return todosItens.find(item => item.id === "coroaPrimeiro");
    }

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

    let disponiveis = todosItens.filter(item => item.raridade === raridadeEscolhida);
    if (disponiveis.length === 0) {
        const raridadesDisponiveis = Object.keys(probabilidades).filter(r => todosItens.some(item => item.raridade === r && probabilidades[r] > 0));
        raridadeEscolhida = raridadesDisponiveis[0];
        disponiveis = todosItens.filter(item => item.raridade === raridadeEscolhida);
    }
    if (disponiveis.length === 0) return todosItens.find(item => item.id === "luva1");
    return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

// ==========================================
// ABRIR BAÚ NORMAL
// ==========================================
function abrirBau(tipo, moeda) {
    let precos = {
        madeira:{moedas:500,golds:10},
        prata:{moedas:2500,golds:40},
        ouro:{moedas:10000,golds:150}
    };

    if (!precos[tipo] || !["moedas","golds"].includes(moeda)) return;
    let preco = precos[tipo][moeda];

    if (moeda === "moedas" && moedas < preco) return alert("Moedas insuficientes!");
    if (moeda === "golds" && golds < preco) return alert("Golds insuficientes!");

    if (moeda === "moedas") moedas -= preco;
    else golds -= preco;

    let item = sortearItem(tipo);
    if (item.id === "coroaPrimeiro") {
        coroaDoPrimeiroConquistada = true;
        inventarioItens.push(item.id);
        document.getElementById("resultadoBau").textContent =
            "👑 INCRÍVEL! Você conquistou a Coroa do Primeiro! É o ÚNICO jogador desta sessão!";
    } else if (inventarioItens.includes(item.id)) {
        moedas += item.conversao;
        document.getElementById("resultadoBau").textContent =
            "🔁 Item repetido! " + item.nome + " convertido em " + item.conversao + " moedas!";
    } else {
        inventarioItens.push(item.id);
        document.getElementById("resultadoBau").textContent =
            "🎉 Você encontrou: " + item.nome + " (" + item.raridade + ")!";
    }
    atualizarMoedas();
    atualizarGolds();
    mostrarInventario();
}

// ==========================================
// BAÚS VIP - ITENS EXCLUSIVOS
// ==========================================
const precosBausVip = {
    vip: {moedas:50000, golds:300},
    supremo: {moedas:200000, golds:800},
    lendario: {moedas:750000, golds:2000}
};

const itensBausVip = {
    vip: [
        {id:"luvaCelestial", chance:40},
        {id:"geradorSolar", chance:40},
        {id:"relogioCelestial", chance:20}
    ],
    supremo: [
        {id:"luvaCelestial", chance:20},
        {id:"geradorSolar", chance:20},
        {id:"relogioCelestial", chance:20},
        {id:"luvaDivina", chance:20},
        {id:"nucleoInfinito", chance:20}
    ],
    lendario: [
        {id:"luvaDivina", chance:35},
        {id:"nucleoInfinito", chance:35},
        {id:"relogioDivino", chance:30}
    ]
};

function sortearItemVip(tipo) {
    const lista = itensBausVip[tipo];
    if (!lista) return null;
    const sorteio = Math.random() * 100;
    let acumulado = 0;
    for (const recompensa of lista) {
        acumulado += recompensa.chance;
        if (sorteio < acumulado) {
            return todosItens.find(item => item.id === recompensa.id) || null;
        }
    }
    return null;
}

function abrirBauVip(tipo, moeda = "moedas") {
    if (!vip) {
        alert("Você precisa ser VIP para abrir esses baús!");
        return;
    }
    const precos = precosBausVip[tipo];
    if (!precos || !["moedas","golds"].includes(moeda)) {
        alert("Baú inválido!");
        return;
    }
    const preco = precos[moeda];
    if (moeda === "moedas" && moedas < preco) return alert("Moedas insuficientes!");
    if (moeda === "golds" && golds < preco) return alert("Golds insuficientes!");

    if (moeda === "moedas") moedas -= preco;
    else golds -= preco;

    const item = sortearItemVip(tipo);
    if (!item) {
        if (moeda === "moedas") moedas += preco;
        else golds += preco;
        atualizarMoedas();
        atualizarGolds();
        alert("Não foi possível sortear um item. O valor foi devolvido.");
        return;
    }

    if (inventarioItens.includes(item.id)) {
        moedas += item.conversao;
        document.getElementById("resultadoBauVip").textContent =
            "🔁 Item VIP repetido! " + item.nome + " convertido em " + item.conversao + " moedas!";
    } else {
        inventarioItens.push(item.id);
        document.getElementById("resultadoBauVip").textContent =
            "👑 RECOMPENSA VIP! Você conquistou " + item.nome + " (" + item.raridade + ")!";
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
        let item = todosItens.find(i => i.id === id);
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

        card.append(titulo, raridade, descricao, status);
        if (!equipado) {
            let botaoEquipar = document.createElement("button");
            botaoEquipar.textContent = "Equipar";
            botaoEquipar.addEventListener("click", () => equiparItem(item.id));
            card.appendChild(botaoEquipar);
        }
        inventario.appendChild(card);
    });
    mostrarAtributosItens();
}

function equiparItem(id) {
    let item = todosItens.find(i => i.id === id);
    if (!item || !inventarioItens.includes(id)) return;
    itensEquipados[item.categoria] = item.id;
    atualizarMoedas();
    mostrarInventario();
}

function mostrarAtributosItens() {
    let bonus = calcularBonusItens();
    let cliqueAtual = ganho + bonus.clique;
    let cicloAtual = ganhoSegundo + bonus.ciclo;
    document.getElementById("atributosItens").innerHTML = `
        <div class="itemInventario"><h3>🖱️ Força do clique</h3><p>${cliqueAtual} moedas por clique</p></div>
        <div class="itemInventario"><h3>⏱️ Ganho automático</h3><p>${cicloAtual} moedas por ciclo</p></div>
        <div class="itemInventario"><h3>⚡ Intervalo de ganho</h3><p>${(bonus.intervalo / 1000).toFixed(2)} segundos</p></div>
    `;
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
mostrarAtributosItens();
