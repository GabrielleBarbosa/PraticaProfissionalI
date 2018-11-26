create table Usuario(
codUsuario int identity(1,1) primary key,
nome varchar(50) not null,
CPF char(14) not null,
telefone varchar(15) not null,
email varchar(50) not null,
senha varchar(30) not null
)

insert into Acesso values ('gabi', 'dkjn', 'n')
	insert into Usuario values('felipe melchior de britto', '528.094.498-05', '19998445620','felipemelchior112@gmail.com', 'F3l1p3l3o')

create table Acesso(
email varchar(50) primary key,
senha varchar(30) not null,
logado char(1)
)

create table Gasto(
codGasto int identity(1,1) primary key,
nome varchar(50)not null,
tipo varchar(20) not null
)

create table GastoUsuario(
codUsuario int not null,
constraint fkCodUsuario foreign key(codUsuario) references Usuario(codUsuario),  
codGasto int not null,
constraint fkCodGasto foreign key (codGasto) references gasto(codGasto),
valor money not null
)

create table SLP(
codUsuario int not null,
constraint fkCodUsuarioSLP foreign key(codUsuario) references Usuario(codUsuario),  
situacao varchar(10),
valorNegativo money, --gastos
salario money,
totalDinheiroGuardado money
)

-------------------------------------------------------------------------------------------------------------------------------------
--proc para INSERIR GASTOS


	alter proc InserirGasto_sp
	@valor money = null,
	@email varchar(50) = null,
	@nome varchar(50) = null,
	@tipo varchar(20) = null
	as
	declare @codGasto int 
	declare @codUsuario int
	if(@valor is not null and @nome is not null and @tipo is not null)
		begin
		if not exists(select * from Gasto where nome = @nome and tipo = @tipo)
			insert into Gasto values (@nome, @tipo)

		select @codGasto = codGasto from Gasto where nome = @nome and tipo = @tipo 
		select @codUsuario = codUsuario from Usuario where email = @email

		if not exists(select * from GastoUsuario where codGasto=@codGasto and codUsuario=@codUsuario)
			insert into GastoUsuario values (@codUsuario, @codGasto, @valor)
	end
	
	---------------------------------------------------------------------------------------------------------------------------------

	--proc a para ALTERAR GASTOS

	create proc AlterarGasto_sp
	@nome varchar(50) = null,
	@valor money = null,
	@tipo varchar(50) = null,
	@email varchar(50) = null
	as
	begin
		declare @codUsuario int
		declare @codGasto int
		select @codUsuario = codUsuario from Usuario where email =  @email
		select @codGasto = codGasto from Gasto where nome = @nome and tipo = @tipo
		Update GastoUsuario set valor = @valor where codUsuario = @codUsuario and codGasto = @codGasto 
	end
	---------------------------------------------------------------------------------------------------------------------------------
	
	--mostrar os itens e o preço
	
	alter proc NomePreco_sp
	@email varchar(50),
	@tipo varchar(20)
	as 
	declare @nome varchar(50)
	select nome into #NomeValor from Gasto where codGasto in(select codGasto from GastoUsuario where codUsuario in(select codUsuario from Usuario where email = @email)) and tipo = @tipo
	alter table #NomeValor add valor money
	
	declare Cursor_Valor Scroll Cursor for select nome from #NomeValor
	Open Cursor_Valor
	  Fetch next from Cursor_Valor into @nome
	  while @@FETCH_STATUS = 0
	  Begin
	 	 update #NomeValor set valor = (select valor from GastoUsuario where codUsuario in(select codUsuario from Usuario where email = @email) and codGasto in(select codGasto from Gasto where nome = @nome and tipo=@tipo)) where nome=@nome
		 Fetch next from Cursor_Valor into @nome
		 print @@FETCH_STATUS
	  end 
	close Cursor_Valor
	deallocate Cursor_Valor
	declare @total money
	select @total = sum(valor) from #NomeValor
	insert into #NomeValor values ('Total', @total)
	select * from #NomeValor
	drop table #NomeValor

----------------------------------------------------------------------------------------------------------------------------------------------

    -- Não inserir usuário se email for repetido
	-- Se inserir usuario inserir coluna no SLP ligada a seu codigo

	alter trigger UsuarioAcesso_tg on Usuario 
	instead of insert
	as 
	declare @nome varchar(50)
	declare @cpf char(14)
	declare @telefone varchar(20)
	declare @email varchar(50)
	declare @senha varchar(30)
	declare @codUsuario int

	select @nome=nome from inserted
	select @cpf=cpf from inserted
	select @telefone=telefone from inserted
	select @email=email from inserted
	select @senha=senha from inserted
	if not exists(select * from Acesso where email = @email)
	begin
		insert into Usuario values (@nome, @cpf, @telefone, @email, @senha)
		select @codUsuario=codUsuario from Usuario where email=@email
		insert into SLP values(@codUsuario,'',0,0,0)
		insert into Acesso values (@email,@senha,'s')
	end
	else 
		print 'Não foi possível adicionar'

----------------------------------------------------------------------------------------------------------------------------------------------
 
 --deletar gastos
	alter proc ExcluirGasto_sp
	@nome varchar(50) = null,
	@email varchar(50) = null,
	@tipo varchar(20) = null
	as
	Begin
		declare @codGasto int
		declare @codUsuario int 

		select @codGasto = codGasto from Gasto where nome = @nome and tipo = @tipo
		select @codUsuario = codUsuario from Usuario where email = @email

		delete from GastoUsuario where codGasto = @codGasto and codUsuario = @codUsuario
	end



	select * from Usuario
	select * from GastoUsuario
	select * from SLP

	exec NomePreco_sp
	@email = 'felipemelchior112@gmail.com',
	@tipo = 'Imovel'

	------------------------------------------------------------------------------------------------------------------------------------------

	--Alterar valorNegativo do SLP sempre que houver alguma alteração em valores de GastoUsuario

	create trigger Total_tg on GastoUsuario
	instead of update, delete, insert
	as 
	declare @codUsuario int
	declare @codGasto int 
	declare @valorAnt money
	declare @valorNovo money
	declare @valorNegativo money
	if exists(select valor from inserted) and exists (select valor from deleted)
	begin 
		select @valorAnt = valor from deleted
		select @valorNovo = valor from inserted 
		select @codGasto = codGasto from deleted
		select @codUsuario = codUsuario from deleted

		Update GastoUsuario set valor = @valorNovo where codUsuario = @codUsuario and codGasto = @codGasto

		select @valorNegativo = valorNegativo from SLP where codUsuario = @codUsuario

		set @valorNegativo = @valorNegativo - @valorAnt + @valorNovo

		Update SLP set valorNegativo=@valorNegativo where codUsuario = @codUsuario
	end
	else if exists (select valor from inserted)
	begin 
		select @valorNovo = valor from inserted 
		select @codGasto = codGasto from inserted 
		select @codUsuario = codUsuario from inserted
	
		insert into GastoUsuario values (@codUsuario, @codGasto, @valorNovo)

		update SLP set valorNegativo += @valorNovo where codUsuario=@codUsuario
	end
	else
	begin 
		select @valorNovo = valor from deleted 
		select @codGasto = codGasto from deleted 
		select @codUsuario = codUsuario from deleted

		delete from GastoUsuario where codUsuario = @codUsuario and codGasto = @codGasto

		update SLP set valorNegativo -= @valorNovo where codUsuario = @codUsuario
	end

	select * from SLP
	update SLP set salario=null



	select * from SLP
	select * from Gasto
	select * from GastoUsuario
	select * from Usuario

	---------------------------------------------------------------------------------------------------

	--Stored Procedured para realziar inserções no campo totalDinheiroGuardado da tabela SLP
	--criado no dia 25/11/2018
	select * from SLP


	create proc GuardarDinheiroNoCaixa_sp
	@email varchar(50) = null,
	@caixa money = null
	as
	declare @codUsuario int 
	declare @total int
	if(@email is null or @caixa is null)
		print'COLOQUE O EMAIL DO USUÁRIO'
	else
		Begin
			select @codUsuario = codUsuario from Usuario where email = @email
			select @total = totalDinheiroGuardado
			update SLP set totalDinheiroGuardado = @caixa where codUsuario = @codUsuario
		End


		select * from SLP





	---------------------------hoje----------------------------------------------------
	alter proc confirmarPagamento_sp 
	@nomeGasto varchar(50) = null,
	@tipoGasto varchar(20) = null,
	@emailUsuario varchar(50) = null
	as 
	if(@nomeGasto is not null and @tipoGasto is not null and @emailUsuario is not null)
	begin
		declare @valor money
		select @valor = valor from GastoUsuario where codUsuario in(select codUsuario from Usuario where email=@emailUsuario) and codGasto in(select codGasto from Gasto where tipo = @tipoGasto and nome = @nomeGasto)
		print @valor
		exec ExcluirGasto_sp @email=@emailUsuario, @tipo = @tipoGasto, @nome = @nomeGasto
		update slp set totalDinheiroGuardado -= @valor where codUsuario in(select codUsuario from Usuario where email=@emailUsuario)
	end

	select * from slp where codUsuario=26
	update slp set valorNegativo = 0, totalDinheiroGuardado = 0, salario = 0

	confirmarpagamento_sp 'oi', 'Imovel', 'gabrielle.gabi.barbosa@gmail.com'




	create proc AlterarDados_sp
@nome varchar(50),
@tel varchar(15),
@emailNovo varchar(50),
@senha varchar(20),
@emailAntigo varchar(50)
as
Begin
	update usuario set 
	nome = @nome,
	telefone = @tel,
	email = @emailNovo,
	senha = @senha 
	where
	email = @emailAntigo

	update Acesso set
	email  =@emailNovo,
	senha = @senha
	where
	email = @emailAntigo
End