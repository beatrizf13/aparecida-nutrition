$(function(){
    $(".titulo").text("Aparecida Nutricionista");
    calcula_tabela_imc();
    add_paciente();
    removerPaciente();
    filtrarPaciente();
    importarXML();
});

const calcula_imc = (peso,altura) => (peso / (altura * altura)).toFixed(2);

const calcula_tabela_imc = () => {
    let pacientes = $(".paciente");
    for (let i = 0; i < pacientes.length; i++) {
        let paciente = pacientes[i];
        let tdPeso = paciente.querySelector(".info-peso");
        let peso = tdPeso.textContent;
        let tdAltura = paciente.querySelector(".info-altura");
        let altura = tdAltura.textContent;
        let tdImc = paciente.querySelector(".info-imc");
        let pesoEhValido = validaPeso(peso);
        let alturaEhValida = validaAltura(altura);

        if (!pesoEhValido) {
            pesoEhValido = false;
            tdImc.textContent = "Peso inválido";
            paciente.classList.add("paciente-invalido");
        }
        if (!alturaEhValida) {
            alturaEhValida = false;
            tdImc.textContent = "Altura inválida";
            paciente.addClass("paciente-invalido");
        }
        if (pesoEhValido && alturaEhValida) tdImc.textContent = calcula_imc(peso,altura);
    }
}

//////////////////////////////////////////////
const validaPeso = peso =>{
    if (peso >= 0 && peso <= 1000) return true;
    else return false;
}
const validaAltura = altura => {
    if (altura >= 0 && altura <= 3.0) return true;
    else return false;
}
const validaGordura = gordura => {
    if (gordura >= 0 && gordura <= 100) return true;
    else return false;
}
const validaPaciente = paciente => {
    let erros = [];
    if (paciente.nome.length==0) erros.push("O nome não pode ser em branco!");
    if (paciente.gordura.length == 0) erros.push("A gordura não pode ser em branco");
    if (paciente.peso.length == 0) erros.push("O peso não pode ser em branco");
    if (paciente.altura.length == 0) erros.push("A altura não pode ser em branco");
    if (!validaPeso(paciente.peso)) erros.push("Peso é inválido");
    if (!validaAltura(paciente.altura)) erros.push("Altura é inválida");
    if(!validaGordura(paciente.gordura)) erros.push("% de gordura é inválida!");
    return erros;
}
const exibeMensagensDeErro = erros => {
    let ul = $("#mensagens-erro");

    ul.html = "";

    erros.forEach(function(erro){
        ul.add("li").text(erro);
    });
}
//////////////////////////////////////////////

//~

//////////////////////////////////////////////
const pegaDadosForm = form => {
    let paciente = {
        nome: form.nome.value,
        peso: form.peso.value,
        altura: form.altura.value,
        gordura: form.gordura.value,
        imc: calcula_imc(form.peso.value, form.altura.value)
    }
    return paciente;
}// aux add_paciente()
const addTd = (dado,classe) => {
    let td = document.createElement("td");
    td.textContent = dado;
    td.classList.add(classe);

    return td;
}// aux add_paciente()
const addTr = paciente => {
    let pacienteTr = document.createElement("tr");
    pacienteTr.classList.add("paciente");

    pacienteTr.appendChild(addTd(paciente.nome,    "info-nome"));
    pacienteTr.appendChild(addTd(paciente.peso,    "info-peso"));
    pacienteTr.appendChild(addTd(paciente.altura,  "info-altura"));
    pacienteTr.appendChild(addTd(paciente.gordura, "info-gordura"));
    pacienteTr.appendChild(addTd(paciente.imc,     "info-imc"));

    return pacienteTr;
}// aux add_paciente()
const add_paciente = () => {
    let botaoAdd = $("#adicionar-paciente");

    botaoAdd.click( function(event){
        event.preventDefault();
        let form = document.querySelector("#form-adciona");
        let paciente = pegaDadosForm(form);

        let erros = validaPaciente(paciente);

        if(erros.length > 0){
            exibeMensagensDeErro(erros);
            return;
        }

        adicionaPacienteNaTabela(paciente);

        form.reset();
        let mensagensErro = $("#mensagens-erro");
        mensagensErro.html = "";

    })
}
const adicionaPacienteNaTabela = paciente => $("#tabela-pacientes").append(addTr(paciente));

////////////////////////////////////////////

//~

//////////////////////////////////////////////
const removerPaciente = () =>  $("#tabela").on("dblclick", function(event){
    $(event.target.parentNode).addClass("fadeOut");
    setInterval(function() {
        event.target.parentNode.remove();
    }, 500);
});

//////////////////////////////////////////////

//~

//////////////////////////////////////////////
const filtrarPaciente = () => {
    $("#filtrar-tabela").on("input", function(){

        let pacientes = $(".paciente");

        if (this.value.length > 0) {
            for (let i = 0; i < pacientes.length; i++) {
                let paciente = pacientes[i];
                let tdNome = paciente.querySelector(".info-nome");
                let nome = tdNome.textContent;
                let expressao = new RegExp(this.value, "i"); //expressao regular, "i" significa que vai procurar maiusculo e minusculo

                if (!expressao.test(nome)) paciente.classList.add("invisivel");
                else paciente.classList.remove("invisivel");
            }
        } else {
            for (let i = 0; i < pacientes.length; i++) {
                let paciente = pacientes[i];
                paciente.classList.remove("invisivel");
            }//mostra a tabela quando o campo de busca for vazio
        }
    });
}
//////////////////////////////////////////////

//~

//////////////////////////////////////////////
const importarXML = () => {
    let botaoAdicionar = $("#buscar-pacientes");

    botaoAdicionar.click(function(){

        let xhr = new XMLHttpRequest();

        xhr.open("GET", "https://api-pacientes.herokuapp.com/pacientes");

        xhr.addEventListener("load", function() {

            let erroAjax = $("#erro-ajax");

            if (xhr.status == 200) {
                erroAjax.addClass("invisivel");
                let pacientes = JSON.parse(xhr.responseText);//extrai o conteudo de texto e transforma em um objeto javascript

                pacientes.forEach(function(paciente) {
                    adicionaPacienteNaTabela(paciente);
                });
            }else erroAjax.removeClass("invisivel");

        });

        xhr.send();
    });
}
//////////////////////////////////////////////
