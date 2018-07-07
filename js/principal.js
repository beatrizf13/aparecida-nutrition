var titulo = document.querySelector(".titulo");
titulo.textContent = "Aparecida Nutricionista";

function calcula_imc(peso,altura){
    var imc = peso / (altura * altura);
    return imc.toFixed(2);
}
function calcula_tabela_imc(){
    var pacientes = document.querySelectorAll(".paciente");
    for (var i = 0; i < pacientes.length; i++) {
        var paciente = pacientes[i];
        var tdPeso = paciente.querySelector(".info-peso");
        var peso = tdPeso.textContent;
        var tdAltura = paciente.querySelector(".info-altura");
        var altura = tdAltura.textContent;
        var tdImc = paciente.querySelector(".info-imc");
        var pesoEhValido = validaPeso(peso);
        var alturaEhValida = validaAltura(altura);

        if (!pesoEhValido) {
            console.log("Peso inválido!");
            pesoEhValido = false;
            tdImc.textContent = "Peso inválido";
            paciente.classList.add("paciente-invalido");
        }
        if (!alturaEhValida) {
            console.log("Altura inválida!");
            alturaEhValida = false;
            tdImc.textContent = "Altura inválida";
            paciente.classList.add("paciente-invalido");
        }
        if (pesoEhValido && alturaEhValida) {
            tdImc.textContent = calcula_imc(peso,altura);
        }
    }
}

//////////////////////////////////////////////
function validaPeso(peso){

    if (peso >= 0 && peso <= 1000) {
        return true;
    } else {
        return false;
    }
}
function validaAltura(altura) {

    if (altura >= 0 && altura <= 3.0) {
        return true;
    } else {
        return false;
    }
}
function validaGordura(gordura) {

    if (gordura >= 0 && gordura <= 100) {
        return true;
    } else {
        return false;
    }
}
function validaPaciente(paciente){
    var erros = [];

    if (paciente.nome.length==0) erros.push("O nome não pode ser em branco!");

    if (paciente.gordura.length == 0) erros.push("A gordura não pode ser em branco");

    if (paciente.peso.length == 0) erros.push("O peso não pode ser em branco");

    if (paciente.altura.length == 0) erros.push("A altura não pode ser em branco");

    if (!validaPeso(paciente.peso)) erros.push("Peso é inválido");

    if (!validaAltura(paciente.altura)) erros.push("Altura é inválida");

    if(!validaGordura(paciente.gordura)) erros.push("% de gordura é inválida!");

    return erros;
}
function exibeMensagensDeErro(erros){
    var ul = document.querySelector("#mensagens-erro");

    ul.innerHTML = "";

    erros.forEach(function(erro){
        var li = document.createElement("li");
        li.textContent = erro;
        console.log(li);
        ul.appendChild(li);
    });
}
//////////////////////////////////////////////

//~

//////////////////////////////////////////////
function pegaDadosForm(form){
    var paciente = {
        nome: form.nome.value,
        peso: form.peso.value,
        altura: form.altura.value,
        gordura: form.gordura.value,
        imc: calcula_imc(form.peso.value, form.altura.value)
    }
    return paciente;
}// aux add_paciente()
function addTd(dado,classe){
    var td = document.createElement("td");
    td.textContent = dado;
    td.classList.add(classe);

    return td;
}// aux add_paciente()
function addTr(paciente){
    var pacienteTr = document.createElement("tr");
    pacienteTr.classList.add("paciente");

    pacienteTr.appendChild(addTd(paciente.nome,    "info-nome"));
    pacienteTr.appendChild(addTd(paciente.peso,    "info-peso"));
    pacienteTr.appendChild(addTd(paciente.altura,  "info-altura"));
    pacienteTr.appendChild(addTd(paciente.gordura, "info-gordura"));
    pacienteTr.appendChild(addTd(paciente.imc,     "info-imc"));

    return pacienteTr;
}// aux add_paciente()
function add_paciente(){
    var botaoAdd = document.querySelector("#adicionar-paciente");

    botaoAdd.addEventListener("click", function(event){
        event.preventDefault();
        var form = document.querySelector("#form-adciona");
        var paciente = pegaDadosForm(form);

        var erros = validaPaciente(paciente);
        console.log(erros);
        if(erros.length > 0){
            exibeMensagensDeErro(erros);
            return;
        }

        adicionaPacienteNaTabela(paciente);

        form.reset();
        var mensagensErro = document.querySelector("#mensagens-erro");
        mensagensErro.innerHTML = "";

    })
}
function adicionaPacienteNaTabela(paciente) {
    var pacienteTr = addTr(paciente);
    var tabela = document.querySelector("#tabela-pacientes");
    tabela.appendChild(pacienteTr);
}
////////////////////////////////////////////

//~

//////////////////////////////////////////////
function removerPaciente() {
    var tabela = document.querySelector("#tabela");
    tabela.addEventListener("dblclick", function(event){
        var alvoEvento = event.target; //td
        var paiDoAlvo = alvoEvento.parentNode; //tr

        paiDoAlvo.classList.add("fadeOut");

        setTimeout(function() {
            paiDoAlvo.remove();
        }, 500);

    });
}
//////////////////////////////////////////////

//~

//////////////////////////////////////////////
function filtrarPaciente() {
    var campoFiltro = document.querySelector("#filtrar-tabela");

    campoFiltro.addEventListener("input", function(){
        console.log(this.value);
        var pacientes = document.querySelectorAll(".paciente");

        if (this.value.length > 0) {
            for (var i = 0; i < pacientes.length; i++) {
                var paciente = pacientes[i];
                var tdNome = paciente.querySelector(".info-nome");
                var nome = tdNome.textContent;
                var expressao = new RegExp(this.value, "i"); //expressao regular, "i" significa que vai procurar maiusculo e minusculo

                if (!expressao.test(nome)) {
                    paciente.classList.add("invisivel");
                } else {
                    paciente.classList.remove("invisivel");
                }//.test pesquisa cada 'pedaço' inserido, ex 'p' , 'pa', 'paulo'
            }
        } else {
            for (var i = 0; i < pacientes.length; i++) {
                var paciente = pacientes[i];
                paciente.classList.remove("invisivel");
            }//mostra a tabela quando o campo de busca for vazio
        }
    });
}
//////////////////////////////////////////////

//~

//////////////////////////////////////////////
function importarXML(){
    var botaoAdicionar = document.querySelector("#buscar-pacientes");

    botaoAdicionar.addEventListener("click", function(){

        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://api-pacientes.herokuapp.com/pacientes");

        xhr.addEventListener("load", function() {

            var erroAjax = document.querySelector("#erro-ajax");

            if (xhr.status == 200) {
                erroAjax.classList.add("invisivel");
                var resposta = xhr.responseText;
                var pacientes = JSON.parse(resposta);//extrai o conteudo de texto e transforma em um objeto javascript

                pacientes.forEach(function(paciente) {
                    adicionaPacienteNaTabela(paciente);
                });
            } else {
                erroAjax.classList.remove("invisivel");
            }

        });

        xhr.send();
    });
}
//////////////////////////////////////////////

calcula_tabela_imc();
add_paciente();
removerPaciente();
filtrarPaciente();
importarXML();
