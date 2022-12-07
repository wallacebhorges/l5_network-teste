// Adicionando Javascript //
const userCep = document.querySelector("#search");
const btnSearch = document.querySelector("#submit");
const alerta = document.querySelector("#alerta");
const clear = document.querySelector("#clear");
var local = document.querySelector("#localizado");
const key = "https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_GOOGLE_API_AQUI&callback&v=weekly";
const callApi = document.createElement("script");
callApi.src = key;

// EVENTO PARA CARREGAR E EXECUTAR A FUNÇÃO QUE EXIBE PESQUISAS ARMAZENADAS NO LOCALSTORAGE
function exibeStorage() {
    if (localStorage.pesquisa) {
        local.innerHTML = `<p class="paragrafo">Pesquisa salva: ${localStorage.pesquisa} 
        <i class="bi bi-search" onclick="rePesquise();" id="research"></i>
        <i class="bi bi-trash-fill" id="clear" onclick="limpa_register();"></i>
        </p>`;
        document.body.appendChild(callApi).defer;
    }
    else {
        local.innerHTML = "Olá, você não tem nenhuma pesquisa salva";
        userCep.addEventListener("click", (e) => {
            local.innerHTML = "";
        })
    }
}
exibeStorage();

// Evento para indexar o google maps na página
userCep.addEventListener("click", (e) => {
    document.body.appendChild(callApi).defer;
})
btnSearch.addEventListener("click", (e) => {
    //Insere script no documento e carrega o conteúdo.
    pesquisacep(this.value);
})
function limpa_search() {
    //Limpa valores pesquisado de cep.
    local.style.display = "none";
    limpa_formulário_cep();
}

// limpa o input de pesquisa e os dados da pesquisa realizada, e se houver algo armazenado, será excluído
function limpa_formulário_cep() {
    if (localStorage.pesquisa != "") {
        localStorage.removeItem('pesquisa');
        localStorage.removeItem('pesquisaCep');
    }
    document.getElementById('search').value = ("");
    local.innerHTML = "";
}

// limpa os dados armazenados
function limpa_register() {
    localStorage.removeItem('pesquisa');
    localStorage.removeItem('pesquisaCep');
    local.innerHTML = "";
}

//Faz um novo carregamento com os dados armazenados
function rePesquise() {
    userCep.value = localStorage.pesquisaCep;
    pesquisacep(this.value);

}

function meu_callback(conteudo) {

    if (!("erro" in conteudo)) {
        //1. Cria uma div com trazendo os dados retornados da pesquisa.
        //2. Após escrever os dados em spans, cria dois botões, um para apagar a pesquisa realizada e limpar o input
        //o outro para salvar no localStorage
        //var end = 
        local.innerHTML = `<p class="paragrafo"><span id="rua">${conteudo.logradouro + ", "}</span>
        <span id="bairro">${conteudo.bairro + " - "}</span>
        <span id="cidade">${conteudo.localidade + " - "}</span>
        <span id="uf">${conteudo.uf}</span>
        <i class="bi bi-cloud-download-fill" id="save"></i>
        <i class="bi bi-trash-fill" id="clear" onclick="limpa_formulário_cep();"></i></p>`;

        var save = document.getElementById('save'); // Cria uma variável para o botão Salvar
        // Ao clicar no botão Salvar, executa-se a função que armazena a pesquisa no localStorage e exibe os valores na tela
        save.addEventListener("click", (e) => {
            // Armazena no localStorage, o cep e endereço informado pelo usúario
            localStorage.pesquisa = "Cep: " + userCep.value + ", " + conteudo.logradouro + ", " + conteudo.bairro + ", " + conteudo.localidade + " - " + conteudo.uf;
            localStorage.pesquisaCep = userCep.value;
            local.innerHTML = `<p id="linhaReplicate" class="paragrafo"><span>${conteudo.logradouro + ", "}</span>
            <span>${conteudo.bairro + " - "}</span>
            <span>${conteudo.localidade + " - "}</span>
            <span>${conteudo.uf}</span>
            <i class="bi bi-search" onclick="rePesquise();" id="research"></i>
            <i class="bi bi-trash-fill" id="clear" onclick="limpa_register();"></i>
            </p>`;
        })

    } //end if.
    else {
        //CEP não Encontrado.
        alerta.innerHTML = "Infelizmente o CEP: " + userCep.value + " não encontrou endereço";
        limpa_formulário_cep();
    }
}

function pesquisacep(valor) {
    //Nova variável "cep" somente com dígitos.
    valor = userCep.value;
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
        
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            // Aqui são as funções para o Google Maps
            // Inicializar e adicionar o mapa

            const geocoder = new google.maps.Geocoder();
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 13,
            });

            geocoder
                .geocode({ address: cep, })
                .then((response) => {
                    const position = response.results[0].geometry.location;

                    map.setCenter(position);
                    new google.maps.Marker({
                        map,
                        position,
                    });
                })
                .catch((e) => alerta.innerHTML = "Infelizmente, o CEP: " + cep + " ainda não consta em nossa geolocalização");


            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            alerta.innerHTML = "O formato " + userCep.value + " não é um CEP válido";
            limpa_formulário_cep()

        }
    } //end if.
    else {
        alerta.innerHTML = "Por gentileza, insira o CEP para fazermos a busca";
    }
    userCep.addEventListener("click", (e) => {
        alerta.innerHTML = "";
    })
};
