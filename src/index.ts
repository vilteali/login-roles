import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import cors = require("cors");
import helmet = require ("helmet");
import routes from './routes'

const PORT = process.env.PORT || 3000;

createConnection().then(async() => {

    // create express app
    const app = express();

    // middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
 
    // routes
    app.use('/', routes);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.error(error));
