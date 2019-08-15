const express = require("express");
const { buildSchema } = require("graphql");
const graphHttp = require("express-graphql");
const mysql = require("mysql");

//连接数据库
var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  database: "graphql"
});

//定义schema，查询和类型，mutation
const schema = buildSchema(`
    input AccountInput {
        name: String
        age: String
        sex: String
        department: String
    }
    type Account {
        name: String
        age: String
        sex: String
        department: String
    }
    type Mutation {
        createAccount(input: AccountInput): Account
        updateAccount(id: ID!,input: AccountInput): Account
        deleteAccount(id: ID!): Boolean
    }
    type Query {
        accounts: [Account]
    }
`);

const root = {
  accounts() {
    let arr = [];
    return new Promise((resolve,reject) => {
        pool.query('select name,age,sex,department from account',(err,data) => {
            if(err){
                console.log('出错',err)
                return 
            }
            for(let i=0;i<data.length;i++){
                arr.push({
                    name:data[i].name,
                    sex:data[i].sex,
                    age:data[i].age,
                    department:data[i].department
                })
            }
            resolve(arr)
        })
    })
  },
  createAccount({ input }) {
    const data = {
      name: input.name,
      sex: input.sex,
      age: input.age,
      department: input.department
    };
    return new Promise((resolve, reject) => {
      pool.query("insert into account set ?", data, err => {
        if (err) {
          console.log("出错了",err);
          return;
        }
        resolve(data);
      });
    });
  },
  updateAccount({ id, input }) {
    const data = input
      return new Promise((resolve, reject) => {
        pool.query("update account set ? where name = ?", [data,id], err => {
          if (err) {
            console.log("出错了",err);
            return;
          }
          resolve(data);
        });
      });
  },
  deleteAccount({id}){
      return new Promise((resolve,reject) => {
          pool.query('delete from account where name = ?',[id],(err) => {
              if(err){
                  console.log(err)
                  reject(false)
                  return
              }
              resolve(true)
          })
      })
  }
};

const app = express();

app.use(
  "/graphql",
  graphHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(3000);
