const express = require('express')
const {buildSchema} = require('graphql')
const graphHttp = require('express-graphql')

//定义schema，查询和类型，mutation
const schema = buildSchema(`
    input AccountInput {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Mutation {
        createAccount(input: AccountInput): Account
        updateAccount(id: ID!,input: AccountInput): Account
    }
    type Query {
        accounts: [Account]
    }
`)

const fakeDb = {}

const root = {
    accounts(){
    let arr = []
    for (const key in fakeDb) {
        arr.push(fakeDb[key])
    }
    return arr
    },
    createAccount({input}){
        //相当于数据库的保存
        fakeDb[input.name] = input
        //返回保存结果
        return fakeDb[input.name]
    },
    updateAccount({id,input}){
        const updateAccount = Object.assign({},fakeDb[id],input) //第二个和第三个属性拷贝到了第一个对象上面
        //相当于数据库的更新
        fakeDb[id] = updateAccount
        return updateAccount
    }
}

const app = express()

const middleWare = (req,res,next) => {
    if(req.headers.cookie){
        if(req.url.indexOf("/graphql") !== -1 && req.headers.cookie.indexOf("auth") === -1){
            res.send(JSON.stringify({
                error:"您没有权限访问这个接口"
            }))
            return
        }
    }else{
        if(req.url.indexOf("/graphql") !== -1){
            res.send(JSON.stringify({
                error:"您没有权限访问这个接口"
            }))
            return
        }
    }
   
    next()
}

app.use(middleWare)

app.use('/graphql',graphHttp({
    schema: schema,
    rootValue: root,
    graphiql:true
}))

app.listen(3000)