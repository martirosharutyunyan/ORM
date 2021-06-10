"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.client = void 0;
require('dotenv').config();
const pg_1 = require("pg");
exports.client = new pg_1.Client({
    database: process.env.POSTGRESDBNAME,
    password: process.env.POSTGRESDBPASSWORD,
    port: 5432,
    host: 'localhost',
    user: 'postgres',
});
exports.client.connect();
class ORM {
    constructor(TABLENAME, columns, params = { force: false, logging: false }) {
        this.TABLENAME = TABLENAME;
        this.columns = columns;
        this.params = params;
        try {
            const array = Object.entries(columns);
            let arr = [];
            for (let i = 0; i < array.length; i++) {
                arr = [...arr, { columnName: array[i][0], type: array[i][1] }];
            }
            ;
            // @ts-ignore
            this.columns = arr;
            if (params.force) {
                exports.client.query(`DROP TABLE ${TABLENAME}`);
                let str = '';
                // @ts-ignore
                for (let i = 0; i < this.columns.length; i++) {
                    str += `${this.columns[i].columnName} ${this.columns[i].type} NOT NULL, `;
                }
                ;
                const SQLQuery = `CREATE TABLE ${TABLENAME} (id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, ${str.slice(0, str.length - 2)});`;
                exports.client.query(SQLQuery).catch(err => console.log(err));
                this.params.logging ? console.log(SQLQuery) : null;
            }
        }
        catch (err) {
            this.params.logging ? console.log(err) : null;
            return err;
        }
    }
    findAll(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!condition) {
                    const SQLQuery = `SELECT * FROM ${this.TABLENAME};`;
                    return (yield exports.client.query(SQLQuery)).rows;
                }
                if (typeof condition.where === 'string') {
                    const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE ${condition.where};`;
                    return (yield exports.client.query(SQLQuery)).rows;
                }
                let values = '';
                const array = Object.entries(condition.where);
                if (array.length - 1 === 0) {
                    for (let i = 0; i < array.length; i++) {
                        values += `${array[i][0]} = '${array[i][1]}'`;
                    }
                    ;
                    const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE ${values};`;
                    this.params.logging ? console.log(SQLQuery) : null;
                    return (yield exports.client.query(SQLQuery)).rows;
                }
                for (let i = 0; i < array.length; i++) {
                    values += `${array[i][0]} = '${array[i][1]}' AND `;
                }
                ;
                const SQLQuery = `SELECT * FROM ${this.TABLENAME} WHERE (${values.slice(0, values.length - 5)});`;
                this.params.logging ? console.log(SQLQuery) : null;
                return (yield exports.client.query(SQLQuery)).rows;
            }
            catch (err) {
                this.params.logging ? console.log(err) : null;
                return err;
            }
        });
    }
    findOne(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [data] = yield this.findAll(condition);
                return data;
            }
            catch (err) {
                this.params.logging ? console.log(err) : null;
                return err;
            }
        });
    }
    insert(args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let columns = '';
                let values = '';
                const arr = Object.entries(args);
                for (let i = 0; i < arr.length; i++) {
                    columns += `${arr[i][0]}, `;
                    values += `'${arr[i][1]}', `;
                }
                ;
                const SQLQuery = `INSERT INTO ${this.TABLENAME} (${columns.slice(0, columns.length - 2)}) VALUES (${values.slice(0, values.length - 2)});`;
                this.params.logging ? console.log(SQLQuery) : null;
                yield exports.client.query(SQLQuery);
            }
            catch (err) {
                this.params.logging ? console.log(err) : null;
                return err;
            }
        });
    }
    update(args, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let values = '';
                const arr = Object.entries(args);
                for (let i = 0; i < arr.length; i++) {
                    values += `${arr[i][0]} = '${arr[i][1]}', `;
                }
                ;
                let conditions = '';
                const array = Object.entries(condition.where);
                if (array.length === 1) {
                    if (typeof condition.where === 'string') {
                        const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${condition.where};`;
                        this.params.logging ? console.log(SQLQuery) : null;
                        return yield exports.client.query(SQLQuery);
                    }
                    for (let i = 0; i < array.length; i++) {
                        conditions += `${array[i][0]} = '${array[i][1]}'`;
                    }
                    ;
                    const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${conditions};`;
                    this.params.logging ? console.log(SQLQuery) : null;
                    return yield exports.client.query(SQLQuery);
                }
                if (typeof condition.where === 'string') {
                    const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${condition.where};`;
                    this.params.logging ? console.log(SQLQuery) : null;
                    return yield exports.client.query(SQLQuery);
                }
                for (let i = 0; i < array.length; i++) {
                    conditions += `${array[i][0]} = '${array[i][1]}' AND `;
                }
                ;
                const SQLQuery = `UPDATE ${this.TABLENAME} SET ${values.slice(0, values.length - 2)} WHERE ${conditions.slice(0, conditions.length - 5)};`;
                this.params.logging ? console.log(SQLQuery) : null;
                return yield exports.client.query(SQLQuery);
            }
            catch (err) {
                this.params.logging ? console.log(err) : null;
                return err;
            }
        });
    }
    delete(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof condition.where === 'string') {
                    const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${condition.where};`;
                    yield exports.client.query(SQLQuery);
                }
                let conditions = '';
                const array = Object.entries(condition.where);
                for (let i = 0; i < array.length; i++) {
                    conditions += `${array[i][0]} = '${array[i][1]}' AND `;
                }
                ;
                const SQLQuery = `DELETE FROM ${this.TABLENAME} WHERE ${conditions.slice(0, conditions.length - 5)};`;
                this.params.logging ? console.log(SQLQuery) : null;
                yield exports.client.query(SQLQuery);
            }
            catch (err) {
                this.params.logging ? console.log(err) : null;
                return err;
            }
        });
    }
}
ORM.STRING = 'VARCHAR';
ORM.INTEGER = 'INTEGER';
ORM.FLOAT = 'FLOAT';
ORM.BOOLEAN = 'BOOLEAN';
// interface user {
//     column1?:number,
//     column2?:number,
//     column3?:number | string,
// }
exports.Table = new ORM('Table2', {
    column1: Number,
    column2: Float64Array,
}, { force: false, logging: true });
// Table.findAll({where:{column1:"ok",column2:12}}).then(res => console.log(res))
// Table.findAll({where:"column2 < 10"})
// Table.findOne({where:{column1:"ok"}})
// Table.findOne({where:"id == 2"})
// Table.insert({column1:"insert test", column2:true})
// Table.update({column1:"update test", column2:10}, {where:"id = 2"})
// Table.update({column1:"update test", column2:false}, {where:{column2:true, column1:"update test"}})
// Table.delete({where:{column2:true, column1:'insert test'}})
// Table.delete({where:'column2 = 10'})
console.log(typeof Number);
//# sourceMappingURL=postgres.js.map