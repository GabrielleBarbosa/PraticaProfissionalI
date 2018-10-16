create table Usuario(
codUsuario int identity(1,1) primary key,
nome varchar(50) not null,
CPF char(14) not null,
telefone varchar(15) not null,
email varchar(50) not null,
senha varchar(30) not null
)

select * from Usuario

create table Acesso(
idUsuario varchar(30) primary key,
senha varchar(30) not null,
dataAcesso datetime not null
)

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
