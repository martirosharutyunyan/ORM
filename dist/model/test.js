"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const pg_1 = require("pg");
const ORM_1 = __importDefault(require("./ORM"));
class Postgres {
    constructor(params) {
        this.params = params;
        this.client = new pg_1.Client(this.params);
        this.client.connect().catch(console.log);
    }
    ;
    define(...args) {
        // @ts-ignore
        return new ORM_1.default(this.client, ...args);
    }
}
const client2 = new Postgres({
    database: process.env.postgresDBname,
    password: process.env.postgresDBpassword,
    port: 5432,
    host: 'localhost',
    user: 'postgres',
});
const table = client2.define('table', { column2: 0 });
table.findAll().then(console.log);
//# sourceMappingURL=test.js.map