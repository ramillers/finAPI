const express = require('express');
const { v4: uuidv4 } = require("uuid"); 

const app = express();

app.use(express.json()); //middleware pra receber um json

//fake database 
const customers = [];

//Middleware
function verifyExistsAccountCPF(request, response, next) {
    const { cpf } = request.params; 

    const customer = customers.find(customer => customer.cpf === cpf); 

    if (!customer) {
        return response.status(400).json({error: "Usuário não encontrado!" })
    }

    request.customer = customer; //tds middlewares q passarem no verify vão ter acesso ao customar (p saber os dados do cpf) 

    return next(); 
}

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

//buscar extrato bancário
app.get("/statement/:cpf", verifyExistsAccountCPF, (request, response) => {
    const { customer } = request; 
    
    return response.json(customer.statement); 
});

app.listen(3333);
