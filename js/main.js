function userLogado(userLogado){
    console.log(userLogado);
}

function erroLogin(error){
    alert("Erro ao logar! Este nome já está em uso!");
    window.location.reload();
}

function mostraMensagens(listaMensagens) {
    console.log(typeof listaMensagens)

    let mensagem = document.querySelector('.container');
    for(let i = 0; i < listaMensagens.data.length; i++){
        let from = listaMensagens.data[i].from;
        let to = listaMensagens.data[i].to;
        let text = listaMensagens.data[i].text;
        let type = listaMensagens.data[i].type;
        let time = listaMensagens.data[i].time;

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
                if(to === username){
                    mensagem.innerHTML += `        
                    <div class="mensagem-recebida privada">
                        <p><span class="horario">${time}</span> <strong>${from}</strong> reservadamente para <strong>${to}</strong>: ${text}</p>
                    </div>`;
                }else{
                    console.log("Mensagem privada para outro!");
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
            .catch(function(error){
                console.log("Problema ao manter o usuário online!", error.response);
            });
    }, 4000);
}

function buscarMensagens() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then(mostraMensagens)
        .catch(function (erro){
            console.log("Erro na busca!" , erro.response);
        })  
}

function enviarMensagem() {
    let mensagem = document.querySelector('input').value;
    let sentObject = {
        from: username,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", sentObject)
        .then(buscarMensagens)
        .catch(function () {
            window.location.reload();
        });
    document.querySelector('input').value = "";
}

function iniciarChat() {

    manterOnline();
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then(function (response) {
            mostraMensagens(response);
            setInterval(buscarMensagens, 3000);
        })
        .catch(function (error) {
            console.log("Problema ao buscar mensagens!", error.response);
        });
    
}

const username = prompt("Qual o seu nome?");

const enterChat = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", { name: username});

enterChat.then(iniciarChat);
enterChat.catch(erroLogin);

