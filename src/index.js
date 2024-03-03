const express = require('express');
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json()); //middleware pra receber um json

//fake database 
const customers = [];

//criação de conta
app.post("/account", (request, response) => {
    const { cpf, name } = request.body; 

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
        return response.status(400).json({error: "Usuário já existe! "})
    }

    //função de cadastrar nova conta 
    customers.push({
        cpf, 
        name, 
        id: uuidv4(),
        statement: [],
    });

    return response.status(201).send(); 
});

app.listen(3333);