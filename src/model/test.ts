require('dotenv').config();
import ORM from './ORM';

const client = new ORM({
    database:'bikesdb',
    password:'hhs13516',
    port:5432,
    host:'localhost',
    user:'postgres',
    logging:true,
})

interface user {
    name?:string
    surname?:string
    age?:number
}

const table = client.define<user>('table2', {name:ORM.STRING, surname:ORM.STRING, age:ORM.INTEGER}, {force:true})
// table.insert({age:12, surname:'Harutyunyan', name:"Martiros"})
// table.update({age:18}, {where:"name = 'Martiros'"})
// table.update({age:18, name:'Martiros'}, {where: {name:"Martiros", age:190}})
// table.findAll({ where: { name:"ok", age:128 } }).then(console.table)






