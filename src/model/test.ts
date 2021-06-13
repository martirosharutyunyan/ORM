require('dotenv').config();
import { Client } from 'pg';
import ORM from './ORM';

const client2 = new ORM({
    database:process.env.postgresDBname,
    password:process.env.postgresDBpassword,
    port:5432,
    host:'localhost',
    user:'postgres',
})

interface user {
    name?:string
    surname?:string
    age?:number
}

const table = client2.define<user>('table2',{name:ORM.STRING, surname:ORM.STRING, age:ORM.INTEGER},{logging:true})
table.findAll().then(console.table)
