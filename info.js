/*
Apos baixar e installar o MongoDB
Ao abrirmos a pasta do "mongodb" teremos dentro uma pasta do diretório "bin". Dentro desta pasta temos um arquivo para o servidor, o "mongod", e um arquivo para o cliente, o "mongo".

O MongoDB já define um diretório padrão para seu banco, mais você pode mudar tal com o seguinte comando:

mongod --dbpath /seu/diretorio/desejado/db
*/


// Criando e inserindo em uma coleção
db.createCollection("alunos")
db.alunos.insert({
    "nome" : "Felipe", 
    "data_nascimento" : new Date (1994,02,26)
})
// outra inserção
db.alunos.insert({
    "nome": "Felipe",
    "data_nascimento": new Date(1994, 02, 26),
    "curso": {
        "nome": "Sistemas de informação"
    },
    "notas": [10.0, 9.0, 4.5],
    "habilidades": [{
        "nome": "inglês",
        "nível": "avançado"
    }, {
        "nome": "taekwondo",
        "nível": "básico"
    }]
})

// Se quisermos conferir o que foi inserido:
db.alunos.find()


// Removendo elementos
// nesse caso estamos removendo pelo id:
db.alunos.remove({
    "_id": ObjectId ("56cb0002b6d75ec12f75d3b5")
})


// Para conseguirmos ler de uma forma mais clara:
db.alunos.find().pretty()


// Consulta AND, OR e iIN
// AND
db.alunos.find({
    "nome" : "Felipe",
    "habilidades.nome" : "inglês"
})

// OR
db.alunos.find({
    $or : [
        {"curso.nome" : "Sistemas de informação"},
        {"curso.nome" : "Engenharia Química"}    
    ]
})
// OR e AND
db.alunos.find({
    $or : [
        {"curso.nome" : "Sistemas de informação"},
        {"curso.nome" : "Engenharia Química"}    
    ],
    "nome" : "Daniela"
})

// IN
db.alunos.find({
    "curso.nome": {
        $in : ["Sistema de informação", "Engenharia Química"]
    }
})