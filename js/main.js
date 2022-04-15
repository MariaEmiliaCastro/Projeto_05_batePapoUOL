function userLogado(userLogado){
    console.log(userLogado);
}

function erroLogin(error){
    console.log(error);
}

function mostraMensagens(listaMensagens) {
    console.log(typeof listaMensagens)
    let arr = listaMensagens.data;
    console.log(arr);
    let mensagem = document.querySelector('.container');
    for(let i = 0; i < listaMensagens.data.length; i++){
        let from = listaMensagens.data[i].from;
        let to = listaMensagens.data[i].to;
        let text = listaMensagens.data[i].text;
        let type = listaMensagens.data[i].type;
        let time = listaMensagens.data[i].time;

        if(type === "status"){
            
        } 
        
        switch(type){
            case "status":
                mensagem.innerHTML += `        
                <div class="mensagem-recebida entrou-saiu">
                    <p><span class="horario">${time}</span> <strong>${from}</strong> ${text}</p>
                </div>`;
                break;
            case "message":
                mensagem.innerHTML += `        
                <div class="mensagem-recebida">
                    <p><span class="horario">${time}</span> <strong>${from}</strong> para <strong>${to}</strong>: ${text}</p>
                </div>`;
                break;
            case "private_message":
                if(to === userLogado){
                    mensagem.innerHTML += `        
                    <div class="mensagem-recebida privada">
                        <p><span class="horario">${time}</span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</p>
                    </div>`;
                }
                break;
            default:
                console.log("Não foi possível identificar o tipo de mensagem");
                break;
        }
        mensagem.lastChild.scrollIntoView();
    }
}

const manterOnline = () => {
    setInterval(function () {
        axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: username})
            .then(console.log("Online"))
            .catch("Nao deu bom!")
    }, 4000);
}

function buscarMensagens() {
    setInterval(function () {
        axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then(mostraMensagens)
        .catch(function (erro){
            console.log(erro.response.status)
        })
    }, 10000);  
}

function enviarMensagem() {
    let mensagem = document.querySelector('input').value;
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA " + mensagem);
    let sentObject = {
        from: username,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", sentObject)
        .then(console.log("Mensagem enviada"))
        .catch(function (error) {
            console.log("Não deu bom!" + error.status); 
        });
    document.querySelector('input').value = "";
}

let mensagensIniciais;
function iniciarChat() {

    manterOnline();
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then(function (response) {
            mensagensIniciais = response.data;
            buscarMensagens();
        })
        .catch(function (error) {
            console.log("Erro na primeira busca!" + error.status); 
        });
    
}

const username = prompt("Qual o seu nome?");

const enterChat = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", { name: username});

enterChat.then(iniciarChat);
enterChat.catch(erroLogin);