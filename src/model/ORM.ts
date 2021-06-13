import { Client } from "pg"

interface DBparams {
    database:string,
    password:string,
    port:number,
    host:string,
    user:string,
}

interface params {
    force?:boolean
    logging?:boolean
}

interface conditionType<T> {
    where:T | string
}

class Table<T> {
    constructor(
        public client:Client,
        public TABLENAME:string,
        public columns:T,
        public params:params = { force:false, logging:false },
    ){
        try {
            const array:Array<string[]> = Object.entries(columns)
            let arr = []
            for (let i:number = 0; i < array.length; i++) {
                // @ts-ignore
                const type = array[i][1] === '' ? 'VARCHAR' : array[i][1] === 0 ? 'INTEGER' : array[i][1] === false ? 'BOOLEAN' : 'FLOAT'   
                arr = [...arr, {columnName:array[i][0], type}]
            };
            // @ts-ignore
            this.columns = arr
            if (params.force) {
                this.client.query(`DROP TABLE ${TABLENAME}`) 
                let str = ''
                // @ts-ignore
                for (let i:number = 0; i < this.columns.length; i++) {
                    str += `${this.columns[i].columnName} ${this.columns[i].type} NOT NULL, ` 
                };
                const SQLQuery:string = `CREATE TABLE ${TABLENAME} (id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, ${str.slice(0, str.length - 2)});`
                this.client.query(SQLQuery).catch(err => console.log(err))
                this.params.logging ? console.log(SQLQuery) : null
            }
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    }

    async findAll(condition?:conditionType<T>) {
        try {
            if(!condition){
                const SQLQuery = `SELECT * FROM ${this.TABLENAME};` 
                return (await this.client.query(SQLQuery)).rows
            }
            if(typeof condition.where === 'string') {
                const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE ${condition.where};`
                return (await this.client.query(SQLQuery)).rows
            }
            let values = '';
            const array = Object.entries(condition.where)
            for (let i:number = 0; i < array.length; i++) {
                values += `${array[i][0]} = '${array[i][1]}' AND `
            };
            const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE (${values.slice(0, values.length - 5)});`
            this.params.logging ? console.log(SQLQuery) : null
            return (await this.client.query(SQLQuery)).rows
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    }

    async findOne(condition:conditionType<T>) {
        try {
            const [ data ] = await this.findAll(condition)
            return data
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    } 

    async insert(args:T) {
        try {
            let columns:string = '';
            let values = ''
            const arr = Object.entries(args)
            for (let i:number = 0; i < arr.length; i++) {
                columns += `${arr[i][0]}, `
                values += `'${arr[i][1]}', `
            };
            const SQLQuery = `INSERT INTO ${this.TABLENAME} (${columns.slice(0, columns.length - 2)}) VALUES (${values.slice(0, values.length - 2)});`
            this.params.logging ? console.log(SQLQuery) : null
            await this.client.query(SQLQuery)
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    }

    async update(args:T, condition:conditionType<T>) {
        try {
            let values = ''
            const arr = Object.entries(args)
            for (let i:number = 0; i < arr.length; i++) {
                values += `${arr[i][0]} = '${arr[i][1]}', `
            };
            let conditions = ''
            if (typeof condition.where === 'string') {
                const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${condition.where};`
                this.params.logging ? console.log(SQLQuery) : null
                return await this.client.query(SQLQuery)
            }
            const array = Object.entries(condition.where)
            for (let i:number = 0; i < array.length; i++) {
                conditions += `${array[i][0]} = '${array[i][1]}' AND `
            };
            const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${conditions.slice(0, conditions.length - 5)};`
            this.params.logging ? console.log(SQLQuery) : null
            return await this.client.query(SQLQuery)
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    }

    async delete(condition:conditionType<T>){
        try {
            if(typeof condition.where === 'string') {
                const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${condition.where};`
                await this.client.query(SQLQuery)    
            }
            let conditions = ''
            const array = Object.entries(condition.where) 
            for (let i:number = 0; i < array.length; i++) {
                conditions += `${array[i][0]} = '${array[i][1]}' AND `
            };
            const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${conditions.slice(0, conditions.length - 5)};`
            this.params.logging ? console.log(SQLQuery) : null
            await this.client.query(SQLQuery)
        } catch(err) {
            this.params.logging ? console.log(err) : null
            return err
        }
    }
}

// example


class ORM  {
    private client:Client;
    static readonly STRING:string = '';
    static readonly INTEGER:number = 0;
    static readonly BOOLEAN:boolean = false;
    static readonly FLOAT:number = 0.1;
    constructor(
        private params:DBparams,
    ){
        this.client = new Client(this.params)
        this.client.connect().catch(console.log)
    };    
    define<T>(...args) {
        // @ts-ignore
        return new Table<T>(this.client,...args);
    }
}

export default ORM