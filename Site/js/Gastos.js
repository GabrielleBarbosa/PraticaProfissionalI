/////////////////////////////////////
listarClientes = function(tbody) {

    $("tbody").empty();

    $.ajax({
        url : "http://localhost:3000/Gastos"

    }).done(function(dados){

        $.each(dados, function(key, val) {
            
            //variável tr para dar um append de linha na tabela
            tr = $("<tr />");

            // --- criar botao ALTERAR que vai ser um link
            var btnAlterar = $("<a />").attr({
                    title: "Alterar registro",
                    href:  "#modalAlteracao"
            });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Alterar cliente",
                                        src: "imagens/edit.png" });
            btnAlterar.append(icone);
            // fim do botao alterar

            // --- criar botao EXCLUIR que vai ser um link
            var btnExcluir = $("<a />").attr({
                                        title: "Excluir registro",
                                        href:  "#" });

            icone = $("<img />").attr({ class: "botao",
                                        title: "Excluir cliente",
                                        src: "imagens/delete.png" });
            btnExcluir.append(icone);
            btnExcluir.click(function(){
                excluir(val.ID);
            });
            // fim do botao excluir

            tdBotoes = $("<td />");

            tdBotoes.append(btnAlterar);
            tdBotoes.append(btnExcluir);

            tr.append(tdBotoes); 

            //colunas da tabela
            tr.append($("<td />").text(val.nome));
            tr.append($("<td />").text(val.valor));

            //adiciona a linha acima montada na tabela
            $("tbody").append(tr);
        });
    }); //ajax
        
};   

/////////////////////////////////////
excluir = function(id){ 
        if(confirm("Tem certeza que deseja excluir?")){
                $.ajax({
                    url: "http://localhost:3000/clientes/"+id,
                    type: 'DELETE'
                }).done(function(){
                    //chamar listarItem
                    listarClientes("tbody");

                }); //done
        }
};
    
/////////////////////////////////////
cadastrar = function(form){
    $.post( "http://localhost:3000/clientes/", form.serialize() ).done(function(data){
        if (!data.erro) {
            form.each(function(data){
                    //limpar formulário
                    this.reset();
            });

            $("#modalInc").closeModal();
        }
        alert(data.mensagem);

        //chamar listarItem
        listarClientes("tbody");
    });
};   


