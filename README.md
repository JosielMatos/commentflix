## 🧪 Tech Stack

- [React](https://reactjs.org)
- [Firebase](https://firebase.google.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 🚀 Como rodar localmente

Clone o projeto em sua máquina.

```bash
$ git clone https://github.com/JosielMatos/commentflix
$ cd commentflix
```

Instale as dependências pelo terminal:
```bash
$ yarn
```

Você vai precisar de um banco de dados no firebase. No firebase console, crie um novo projeto, adicione uma <strong>realtime database</strong> e na aba regras coloque as seguintes:

```
{
  "rules": {
    "rooms": {
      ".read": false,
    	".write": "auth != null",
      "$roomId": {
        ".read": true,
        ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)",
        "questions": {
          ".read": true,
          ".write": "auth != null && (!data.exists() || data.parent().child('authorId').val() == auth.id)",
          "likes": {
          	".read": true,
            ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)",
          }
        }
      }
    }
  }
}
```
Na página de configurações do projeto, você consegue as chaves e links necessários para preencher as variáveis de ambiente.

Para rodar o projeto:
```
$ yarn start
```
Acesse http://localhost:3000 no navegador.

## Versão Live

- [Aqui](https://commentflix.vercel.app/) Você pode testar minha versão publicada na vercel.

- Use o código -NCFe9BwY0X1nRh3WFFu para entrar em uma sala que eu criei pra testar, caso não queira logar com o google para criar uma sala.

- Caso crie uma sala, o link do vídeo do youtube precisa estar "puro", sem querys de tempo pra poder pegar o hash certinho.