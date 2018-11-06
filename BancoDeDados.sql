create table Usuario(
codUsuario int identity(1,1) primary key,
nome varchar(50) not null,
CPF char(14) not null,
telefone varchar(20) not null,
email varchar(50) not null,
senha varchar(30) not null
)

select * from Usuario
drop table Acesso

create table Acesso(
email varchar(50) primary key,
senha varchar(30) not null
)

create trigger UsuarioAcesso_tg on Usuario 
instead of insert
as 
declare @nome varchar(50)
declare @cpf char(14)
declare @telefone varchar(20)
declare @email varchar(50)
declare @senha varchar(30)

select @nome=nome from inserted
select @cpf=cpf from inserted
select @telefone=telefone from inserted
select @email=email from inserted
select @senha=senha from inserted
if not exists(select * from Acesso where email = @email)
	insert into Usuario values (@nome, @cpf, @telefone, @email, @senha)
else 
	print 'Não foi possível adicionar'

create table Gasto(
codGasto int primary key,
nome varchar(100)not null,
tipo varchar(50) not null
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
constraint fkCodUsuario foreign key(codUsuario) references Usuario(codUsuario),  
codGasto int not null,
constraint fkCodGasto foreign key (codGasto) references gasto(codGasto), 
codSLP int primary key,
situacao varchar(10),
valor money
)

create table Salario(
codUsuario int not null,
constraint fkCodUsuario foreign key(codUsuario) references Usuario(codUsuario),  
codSalario int primary key,
salario money
)
