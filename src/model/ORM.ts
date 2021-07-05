import { Client } from "pg"
import { createConnection } from 'mysql'



export const conn = createConnection({
    host:'localhost',
    user:process.env.mysqlUser,
    database:process.env.mysqlDB,
    password:process.env.mysqlPassword
})

interface DBparams {
    database:string,
    password:string,
    port:number,
    host:string,
    user:string,
    logging?:boolean
}

interface conditionType<T> {
    where:T | string
}

interface params {
    force:boolean
}


class Table<T> {
    constructor(
        public client:Client,
        public TABLENAME:string,
        public columns:T,
        public params = { force:false }, 
        public logging:boolean = false, 
    ){
        try {
            const array:Array<string[]> = Object.entries(columns)
            let arr = []
            for (let i:number = 0; i < array.length; i++) {
                // @ts-ignore
                const type = array[i][1] === '' ? 'VARCHAR' : array[i][1] === 0 ? 'INTEGER' : array[i][1] === false ? 'BOOLEAN' : 'FLOAT'   
                arr = [...arr, { columnName: array[i][0], type }]
            };
            // @ts-ignore
            this.columns = arr
            if (this.params.force) {
                this.client.query(`DROP TABLE ${TABLENAME}`) 
                // @ts-ignore
                let columns = this.columns.map(e => `${e.columnName} ${e.type} NOT NULL`).join(', ')
                const SQLQuery:string = `CREATE TABLE ${TABLENAME} (id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, ${columns});`
                this.client.query(SQLQuery).catch(console.error)
                this.logging ? console.log(SQLQuery) : null
            }
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    }

    async findAll(condition?: conditionType<T>) {
        try {
            if (!condition) {
                const SQLQuery = `SELECT * FROM ${this.TABLENAME};` 
                this.logging ? console.log(SQLQuery) : null
                return (await this.client.query(SQLQuery)).rows
            }
            if(typeof condition.where === 'string') {
                const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE ${condition.where};`
                this.logging ? console.log(SQLQuery) : null
                return (await this.client.query(SQLQuery)).rows
            }
            const array = Object.entries(condition.where)
            const values = array.map(([column, value]) => `${column} = '${value}'`).join(' AND ')
            const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE (${values});`
            this.logging ? console.log(SQLQuery) : null
            return (await this.client.query(SQLQuery)).rows
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    }

    async findOne(condition: conditionType<T>) {
        try {
            const [ data ] = await this.findAll(condition)
            return data
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    } 

    async insert(args: T) {
        try {
            const arr = Object.entries(args)
            const columns = arr.map(([column]) => `${column}`).join(', ')
            const values = arr.map(([column, value]) => `${value}`).join(', ')
            const SQLQuery = `INSERT INTO ${this.TABLENAME} (${columns}) VALUES (${values});`
            this.logging ? console.log(SQLQuery) : null
            await this.client.query(SQLQuery)
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    }

    async update(args: T, condition: conditionType<T>) {
        try {
            const arr = Object.entries(args)
            const values = arr.map(([column, value]) => `${column} = '${value}'`).join(', ')
            if (typeof condition.where === 'string') {
                const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values} WHERE ${condition.where};`
                this.logging ? console.log(SQLQuery) : null
                return await this.client.query(SQLQuery)
            }
            const array = Object.entries(condition.where)
            const conditions = array.map(([column, value]) => `${column} = '${value}'`).join(' AND ')
            const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values} WHERE ${conditions};`
            this.logging ? console.log(SQLQuery) : null
            return await this.client.query(SQLQuery)
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    }

    async delete(condition: conditionType<T>){
        try {
            if(typeof condition.where === 'string') {
                const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${condition.where};`
                this.logging ? console.log(SQLQuery) : null
                await this.client.query(SQLQuery)    
            }
            const array = Object.entries(condition.where) 
            const conditions = array.map(([column, value]) => `${column} = '${value}'`).join(' AND ')
            const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${conditions};`
            this.logging ? console.log(SQLQuery) : null
            await this.client.query(SQLQuery)
        } catch(err) {
            this.logging ? console.error(err) : null
            return err
        }
    }
}


class ORM  {
    private client:any;
    static readonly STRING:string = '';
    static readonly INTEGER:number = 0;
    static readonly BOOLEAN:boolean = false;
    static readonly FLOAT:number = 0.1;
    constructor(
        private params:DBparams,
    ){
        this.client = new Client(this.params) 
        this.client.connect().catch(console.error)
    };    
    define<T>(TABLENAME: string, args: T, params?: params) {
        return new Table<T>(this.client, TABLENAME, args, params, !!this.params.logging);
    }
}


export default ORM