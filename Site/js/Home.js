
    var imgPorco = new Image();
    var imgMoeda = new Image();
    var imgFundo = new Image();
    imgFundo.src = "Imagens/Nuvem.png";
    imgMoeda.src = "Imagens/Moeda.png";
    imgPorco.src = "Imagens/Porquinho.png";

    var objCanvas=null;
    var objContexto=null;

    var posicaoPorco = 240;
    var posicaoMoeda = 40;
    var timerDaMoeda = null;

    var paraCima = true;

    function Iniciar(){
        objCanvas = document.getElementById("meuCanvas");
        objContexto = objCanvas.getContext("2d");

        timerDaMoeda = setInterval(function(){MudarMoeda()},100);
        AtualizarTela();
    }

    function AtualizarTela(){
        objContexto.drawImage(imgFundo,0,0);
        objContexto.drawImage(imgMoeda,167,posicaoMoeda);
        objContexto.drawImage(imgPorco,80,30);
    }

    function MudarMoeda(){
        if(posicaoMoeda == 35)
           paraCima = false;
        else if(posicaoMoeda == 40)
            paraCima = true;

        if(paraCima)
           posicaoMoeda = posicaoMoeda - 1;
        else
           posicaoMoeda = posicaoMoeda + 1;
        AtualizarTela();
    }