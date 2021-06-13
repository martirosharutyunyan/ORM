"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const ORM_1 = __importDefault(require("./ORM"));
const client2 = new ORM_1.default({
    database: process.env.postgresDBname,
    password: process.env.postgresDBpassword,
    port: 5432,
    host: 'localhost',
    user: 'postgres',
    logging: true,
    dialect: 'postgresql'
});
const table = client2.define('table2', { name: ORM_1.default.STRING, surname: ORM_1.default.STRING, age: ORM_1.default.INTEGER });
// table.insert({age:12, surname:'Harutyunyan', name:"Martiros"})
// table.update({age:18}, {where:"name = 'Martiros'"})
table.update({ age: 18 }, { where: { name: "Martiros" } });
table.findAll().then(console.table);
//# sourceMappingURL=test.js.map