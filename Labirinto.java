import java.io.BufferedReader;
import java.io.FileReader;
import java.io.*;

public class Labirinto
{
	protected char[][] labirinto;
	protected Coordenada atual;
	protected Pilha<Coordenada> caminho;
	protected Pilha<Fila<Coordenada>> possibilidades;
	protected Fila<Coordenada> fila;
	protected int qtasCoordCaminho = 0;
	protected int linhas;
	protected int colunas;

	public Labirinto(String arquivo) throws Exception
	{
		FileReader arq = new FileReader(arquivo);
		BufferedReader leitorDeArq = new BufferedReader(arq);

		this.linhas = Integer.parseInt(leitorDeArq.readLine());
		this.colunas = Integer.parseInt(leitorDeArq.readLine());

		labirinto = new char[this.linhas][this.colunas];

		for(int x=0; x<this.linhas; x++)
		{
			String linhaArq = leitorDeArq.readLine();
			for(int y=0; y<this.colunas; y++)
			this.labirinto[x][y] = linhaArq.charAt(y);
	    }

	    Pilha<Coordenada> caminho = new Pilha<Coordenada>(colunas * linhas);
	    possibilidades = new Pilha<Fila<Coordenada>>(linhas*colunas);
	    atual = new Coordenada(0,0);
	}

	public void acharEntrada() throws Exception
	{
		Boolean achado = false;
		int x=0, y=0;
		for(int i=1; i<(2*colunas+2*linhas)-4 || !achado; i++)
		{
			if(labirinto[x][y] == 'E')
			{
			   this.atual.setCoordenada(x, y);
			   achado = true;
			}

			if(x == 0 && y < colunas - 1)
			   y++;
			else if(y == colunas - 1 && x < linhas - 1)
			   x++;
			else if(x == linhas - 1 && y > 0)
			   y--;
			else if(y == 0 && x > 0)
			   x--;
		}

		if(!achado)
		    throw new Exception("A anta que criou este labirinto não criou uma entrada!");
	}

	public void andar() throws Exception
	{
		this.fila = new Fila<Coordenada>(3);
		int x = this.atual.getX();
		int y = this.atual.getY();

		if(x-1>=0)
		   if (this.labirinto[x-1][y] == ' ' || this.labirinto[x-1][y] == 'S')
			  this.fila.guarde(new Coordenada(x-1,y));

		if(x+1<this.linhas)
		   if(this.labirinto[x+1][y] == ' ' ||this.labirinto[x+1][y] == 'S' )
			  this.fila.guarde(new Coordenada(x+1,y));

		if(y+1<this.colunas)
		   if(this.labirinto[x][y+1] == ' ' ||this.labirinto[x][y+1] == 'S' )
			  this.fila.guarde(new Coordenada(x,y+1));

		if(y-1>=0)
		   if(this.labirinto[x][y-1] == ' ' ||this.labirinto[x][y-1] == 'S' )
			  this.fila.guarde(new Coordenada(x,y-1));


		while(this.fila.isVazia())
		{
			retroceder();
		}

		this.atual.setCoordenada(fila.getUmItem());
		this.fila.jogueForaUmItem();

		if(!achouFim())
		{
			this.labirinto[atual.getX()][atual.getY()] = '*';
			this.caminho.guarde(atual);
			this.qtasCoordCaminho++;
			this.possibilidades.guarde(fila);
		}
	}

	private void retroceder() throws Exception
	{
		if(this.possibilidades.isVazia())
		   throw new Exception("Anta!!! Não há caminhos");

		this.fila = new Fila<Coordenada>(3);
		this.labirinto[atual.getX()][atual.getY()] = ' ';
		this.atual = caminho.getUmItem();
		this.caminho.jogueForaUmItem();
		this.qtasCoordCaminho--;

		/*Fila<Coordenada> semCriatividade = possibilidades.getUmItem();


		while(!semCriatividade.isVazia())
		{
		   fila.guarde(semCriatividade.getUmItem());
		   semCriatividade.jogueForaUmItem();
		}*/

		this.fila = possibilidades.getUmItem();
		this.possibilidades.jogueForaUmItem();
	}

	public Boolean achouFim()
	{
		if(this.atual == null)
		   return false;

		if(this.labirinto[atual.getX()][atual.getY()] == 'S')
		   return true;

		return false;
	}

	public Pilha<Coordenada> caminhoPercorrido() throws Exception
	{
		Pilha<Coordenada> inverso = new Pilha<Coordenada> (this.qtasCoordCaminho);

		for(int i = 0; i<this.qtasCoordCaminho; i++)
		{
			this.inverso.guarde(caminho.getUmItem());
			this.caminho.jogueForaUmItem();
		}

		return inverso.clone();
	}

	public String[] linhasDoLabirinto()
	{
		String[] linhasMatriz = new String[this.linhas];

		for(int x1=0; x1<this.linhas; x1++)
			for(int y1=0; y1<this.colunas; y1++)
			    linhasMatriz[x1] += this.labirinto[x1][y1] + "";

		return linhasMatriz;
	}

	public int getLinhas()
	{
		return this.linhas;
	}

	public Boolean equals(Object obj)
	{
		if(obj == null)
		   return false;

		if(this == obj)
		   return true;

		if(this.getClass() != obj.getClass())
		   return false;

		Labirinto lab = (Labirinto)obj;

	    if(this.colunas != lab.colunas)
	       return false;

	    if(this.linhas != lab.linhas)
	       return false;

	    for(int x=0; x<this.linhas; x++)
	       for(int y=0; y<this.colunas; y++)
	          if(this.labirinto[x][y] != lab.labirinto[x][y])
	             return false;

	    return true;
	}

	public String toString()
	{
		return "Posição atual no labirinto: " + atual.toString();
	}

	public int hashCode()
	{
		int ret = 1;

		ret += ret*2 + this.atual.hashCode();
		ret += ret*2 + this.caminho.hashCode();
		ret += ret*2 + this.possibilidades.hashCode();
		ret += ret*2 + this.fila.hashCode();
		ret += ret*2 + new Integer(this.qtasCoordCaminho).hashCode();
		ret += ret*2 + new Integer(this.linhas).hashCode();
		ret += ret*2 + new Integer(this.colunas).hashCode();

		for(int x=0; x<this.linhas; x++)
			for(int y=0; y<this.colunas; y++)
			    ret += ret*2 + labirinto[x][y].hashCode();

		return ret;
	}
}
























}