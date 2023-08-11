# Talker Manager

Uma lista de planetas do universo StarWars com filtros de pesquisa. O app utiliza Context API e Hooks para controlar os estados globais.

## Começando

Para testar a aplicação localmente, clone o repositório e siga os seguintes passos:

Obs: Garanta que tenha o docker e o docker-compose instalados no seu sistema.

1. **Início rápido com docker no terminal:**

```
$ docker-compose up -d
```

2. **Acesse o terminal do container:**

```
$ docker exec -it talker_manager bash
```

3. **Inicie a aplicação no terminal do container:**

```
$ npm start
```
ou

```
$ npm run dev
```

4. **A partir do seu client de requisições HTTP (como o Thunder Client, extensão do vscode), explore os endpoints possíveis para a aplicação :**

- Retorna um array com todas as pessoas palestrantes cadastradas:
```
GET http://localhost:3001/talker/
```

- Retorna a pessoa palestrante com base no id da rota (substitua 'id' por um id numérico):
```
GET http://localhost:3001/talker/id
```

- Retorna um token aleatório de 16 caracteres:
```
POST http://localhost:3001/login/
```

    > O corpo da requisição deve ter a seguinte estrutura:
    {
    "email": "email@email.com",
    "password": "123456"
    }

- Adiciona uma nova pessoa palestrante:
```
POST http://localhost:3001/talker/
```

    > O corpo da requisição deve ter a seguinte estrutura:
    {
    "name": "Danielle Santos",
    "age": 56,
    "talk": {
        "watchedAt": "22/10/2019",
        "rate": 5
    }
    }

- Atualiza uma pessoa palestrante de acordo com o id (substitua id por um id numérico):
```
PUT http://localhost:3001/talker/id
```

    > O corpo da requisição deve ter a seguinte estrutura:
    {
    "name": "Danielle Santos",
    "age": 56,
    "talk": {
        "watchedAt": "22/10/2019",
        "rate": 5
    }
    }

- Deleta uma pessoa palestrante de acordo com o id (substitua 'id' por um id numérico):
```
DELETE http://localhost:3001/talker/id
```

- Retorna um array de palestrantes que contém em seu nome um termo de busca (substitua 'searchTerm' pelo termo de busca):
```
GET http://localhost:3001/talker/search?q=searchTerm
```

- Retorna um array de palestrantes que contém a propriedade rate especificada (substitua 'rateNumber' pelo termo de busca):
```
GET http://localhost:3001/talker/search?rate=rateNumber
```

- Retorna um array de palestrantes que contém a propriedade date especificada (substitua 'watchedDate' pela data no formato DD/MM/AAAA):
```
GET http://localhost:3001/talker/search?date=watchedDate
```

- Altera a avaliação de uma pessoa palestrante com base no ID (substitua 'id' pelo id numérico da pessoa palestrante):
```
PATCH http://localhost:3001/talker/rate/id
```

    > O corpo da requisição deve ter a seguinte estrutura:
    {
    "rate": 5
    }
