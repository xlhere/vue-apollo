const express = require('express')
const {buildSchema} = require('graphql')
const graphHttp = require('express-graphql')

const schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
        salary(city:String):Int
    }
    type Query {
        getClassMates(classNo: Int!): [String]
        account(userName: String): Account
    }
`)

const root = {
    getClassMates({classNo}){
        const obj = {
            1:['张三','李四','王五'],
            2:['张小三','李小四','王小五'],
        }
        return obj[classNo]
    },
    account({userName}){
        const name = userName
        const sex = '男'
        const age = 19
        const department= '计算机'
        const salary = ({city}) => {
            if(city ==='北京' || city ==="上海"){
                return 1000
            }
            return 8000
        }
        return {
            name,
            age,
            sex,
            department,
            salary
        }
    }
}

const app = express()

app.use('/graphql',graphHttp({
    schema: schema,
    rootValue: root,
    graphiql:true
}))

//公开文件夹，供用户访问静态资源
app.use(express.static('public'))

app.listen(3000)