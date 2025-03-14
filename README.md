# EscolaDeEsporte

## Descrição
Projeto da Escola de Esportes.

## Instalação
1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Crie um arquivo `.env` com as seguintes variáveis:
    ```
    MONGO_URI=mongodb://seu_usuario:sua_senha@seu_host:seu_porta/seu_banco
    PORT=5000
    JWT_SECRET=sua_chave_secreta
    ```

## Uso
1. Inicie o servidor com `npm start`.
2. Acesse `http://localhost:5000` no seu navegador.

## Funcionalidades
- Gestão de alunos.
- Exportação de tabelas para Excel.
- Filtros de escola, salas e pagamento.
- Gráficos no dashboard.
- Criação de posts (somente para administradores).

## Criação de Posts
1. Faça login como administrador.
2. Clique no botão "Criar Post".
3. Preencha o formulário com título, texto, imagem, vídeo e outros arquivos.
4. Clique em "Postar" para criar o post.
