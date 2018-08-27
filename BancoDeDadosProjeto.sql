create table Usuario(
codUsuario int primary key,
dataNascimento datetime not null,
endereco varchar(30) not null,
CPF varchar(14) not null,
telefone varchar(15) not null,
email varchar(50) not null
)

create table Acesso(
idUsuario varchar(30) primary key,
senha varchar(30) not null,
dataAcesso datetime not null
)

create table Gasto(
codGasto int primary key,
reparosCasa money,
reparosVeiculo money,
combustivel money,
compraVeiculo money,
compraImovel money,
compras money,
cinema money,
contaAgua money,
contaEnergia money, 
impostos money
)

create table TiposDeGasto(
codTiposDeGasto int primary key,
codGasto int not null,
constraint fkGasto foreign key(codGasto) references Gasto(codGasto),
domestico money,
automovel money,
lazer money,
imovel money,
impostos money,
contas money,
total money
)

create table Multas(
codMulta int primary key,
dataEnergia datetime not null,
dataAgua datetime not null,
dataImpostos datetime not null,
veiculo money
)

create table SLP(
codSLP int primary key,
situacao varchar(8),
valor money
)

create table Salario(
codSalario int primary key,
salario money
)

