const express = require('express')
const {buildSchema} = require('graphql')
const graphHttp = require('express-graphql')

const schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Query {
        hello: String
        accountName: String
        account: Account
    }
`)

const root = {
    hello: () => {
        return 'hello World'
    },
    accountName: ()=> {
        return 'name'
    },
    account: ()=> {
        return {
            name: 'Bob',
            age: '18',
            sex: '男',
            department: 'computer'
        }
    }
}

const app = express()

app.use('/graphql',graphHttp({
    schema: schema,
    rootValue: root,
    graphiql:true
}))

app.listen(3000)