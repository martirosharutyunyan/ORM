"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// import { client } from './model/ORMForDevelopment';
const app = express_1.default();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8888;
// client.connect().then(res => console.log('Connected to DB')).catch(err => console.log(err))
app.use(cors_1.default());
app.use(morgan_1.default(`dev`));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: false
}));
app.listen(port, () => console.log(`server is runnig on port http://localhost:${port}`));
//# sourceMappingURL=server.js.map