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

// UPDATE

// realiza a total troca do conteudo não apenas
// aquele atributo específico
db.alunos.update(
    // registro buscado
    {"_id": ObjectId ("56cb0002b6d75ec12f75d3b5")},
    {"nome" : "Marcos"}
)

// $set permite mudar um registro específico
db.alunos.update(
    {"nome": "Felipe"},
    {
        $set: {
            "curso.nome": "Medicina"
        }
    }
)
// para mudar multiplos registros
db.alunos.update(
    {"nome": "Felipe"},
    {
        $set: {
            "curso.nome": "Medicina"
        }
    },
    {multi: true}
)

// UPDATE com operadores de array
{
    "_id": ObjectId("56cb0002b6d75ec12f75d3b5"),
    "nome": "Felipe",
    "notas": [4, 7, 4.5]
}

// $push : adiciona um elemento no array
db.alunos.update(
    {"_id": ObjectId("56cb0002b6d75ec12f75d3b5")},
    {
        $push: {
            "notas": 8.5
        }
    }
)
//> "notas": [4, 7, 4.5, 8.5]

// $push c/ $each : adiciona mais de um elemento no array
db.alunos.update(
    {"_id": ObjectId("56cb0002b6d75ec12f75d3b5")},
    {
        $push: {
            "notas": { $each: [8.5, 3] }
        }
    }
)
//> "notas": [4, 7, 4.5, 8.5, 8.5, 3]


// busca "maior que" (>)
db.alunos.find({
    notas : { $gt : 5 }
})

// busca o 1° que encontrar
// traz apenas um registro
db.alunos.findOne({
    notas : { $gt : 5 }
})

// busca ordenada 1 e -1
db.alunos.find().sort({"nome" : 1})     // crescente
db.alunos.find().sort({"nome" : -1})    // decrescente

// definindo um limit de registros
db.alunos.find().sort({"nome" : 1}).limit(3)


// Importando arquivos
// mongoimport -c alunos --jsonArray < alunos.json
// -c            : collection
// --jsonArray   : um array de json
// < alunos.json : indica o arquivo

// busca de proximidade
/**
 * Vamos utilizar o aggregate, para agregar um conjunto de dados. 
 * Passaremos um dicionário que deve ter alguns parâmetros, o primeiro é 
 * o tipo de busca que queremos fazer, como é uma procura por proximidade
 * usaremos o $geoNear. O segundo parâmetro é o near que indica que 
 * queremos aquilo que esteja próximo a uma coordenada específica. 
 * Por fim, passaremos também as coordinates (longitude e latitude)
 * e o type que no caso é "Point". Para conferir as coordenadas de
 * alguém podemos fazer a consulta no material já preparado, 
 * o "alunos.json".
 * Temos que passar ao MongoDB que ele deve realizar essa busca procurando 
 * o campo localização. Então, temos que criar um índice de busca, o 
 * db.alunos.createIndex() e nele passaremos o campo localização que 
 * possui uma estrutura de "ponto", com latitude e longitude. Na verdade,
 * a chave localização deve ser indexada para uma busca em uma esfera 2d,
 *  pois contam apenas duas dimensões. Teremos o seguinte em nosso Editor:
 * 
 */
db.alunos.aggregate([
{
    $geoNear : {
        near : {
            coordinates: [-23.5640265, -46.6527128],
            type : "Point"
        }

    }
}
])

db.alunos.createIndex({
    localizacao : "2dsphere"
})

/**
 * Executaremos o db.alunos.createIndex no Terminal e ele irá criar um índice. 
 * Agora, precisamos mostrar como calcular a distância entre esses dois pontos. 
 * Teremos que falar ao $geoNear que a forma é spherical : true, ou seja, que a 
 * comparação não deve ser entre as distâncias de uma linha, e sim, de uma esfera. 
 * Além disso, temos que falar o que deve ser feito com a distância, então, temos 
 * que criar o campo distanceField : "distance.calculada". Teremos o seguinte:
 */
db.alunos.aggregate([
{
    $geoNear : {
        near : {
            coordinates: [-23.5640265, -46.6527128],
            type : "Point"
        },
        distanceField : "distancia.calculada",
        spherical : true
    }
}
])
/**
 * Rodando isso no Terminal ele nos traz todos os alunos:
 * Repare que o primeiro ponto mostrado é aquele que está mais próximo
 * e é o próprio Marcelo. O segundo mais próximo é "Sofia" e assim por 
 * diante. Foi ordenado do mais próximo para o mais distante e isso é 
 * medido através da distância entre dois pontos. O primeiro ponto é a 
 * coordenada que estamos passando e o segundo é o índice que criamos.
 * 
 * Podemos pedir para que apenas 4 pontos sejam trazidos através do 
 * num : 3. Agora que sabemos como buscar pontos vamos aprender a ignorar 
 * o primeiro ponto que é o próprio "Marcelo". Vamos adicionar ao 
 * db.alunos.aggregate o num : 4 e para pular um, skip : 1.
 */
db.alunos.aggregate([
{
    $geoNear : {
        near : {
            coordinates: [-23.5640265, -46.6527128],
            type : "Point"
        },
        distanceField : "distancia.calculada",
        spherical : true,
        num : 4
    }
},
{ $skip :1 }
])
/**
 * E, agora, ele terá ignorado o próprio ponto "Marcelo" e mostrado 
 * os outros três mais próximos. Por isso, nos é mostrado apenas 
 * três alunos. No final é como se ele não mostrasse 4 elementos, 
 * mas sim 4 - 1:
 * 
 * Se quisermos pegar outro aluno para testarmos basta passar as 
 * coordenadas desse aluno ao campo coordinates. É assim que buscamos 
 * por proximidade.
 */
    
