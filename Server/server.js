const express = require("express")
const path = require("path")
const morgan = require("morgan")
const error = require("http-errors")
const cors = require("cors")
const { AllRoutes } = require("./Routes/RouteCenter")
const fs = require("fs")
const { Sequelize } = require('sequelize');
const { EJSRoutes } = require("../Client/Routes/FrontRoute")
const dotenv = require("dotenv").config()
const cookieParser = require('cookie-parser');




module.exports = class Aplication{
    #app = express()
    #PORT
    constructor(PORT){
        this.#PORT = PORT
        this.configApplication()
        this.initTemplateEngine()
        this.connectToPostgres()
        this.createRoutes()
        this.createServer()
        this.errorHandller()
    }
    configApplication(){
        this.#app.use(cors())
        this.#app.use(morgan("dev"))
        this.#app.use(cookieParser())
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({ extended: true }))
        this.#app.use(express.static(path.join(__dirname, "../Public")))
        this.#app.use('/css', express.static(path.join(__dirname, '../Client/CSS')));
        this.#app.use('/js', express.static(path.join(__dirname, '../Client/JS')));
        this.#app.use('/EJS', express.static(path.join(__dirname, '../Client/EJS')));
   
    }
    initTemplateEngine(){
        this.#app.set("view engine", "ejs")
        this.#app.set("views", "Client/EJS")
        this.#app.set("layout extractStyles", true)
        this.#app.set("layout extractScripts", true)
        this.#app.use('/', EJSRoutes);

    }
    createRoutes(){
        this.#app.use(AllRoutes)
    }
    connectToPostgres(){
        const sequelize = new Sequelize('postgres://ChatHub:A8XqYEWSVFRgBth@localhost:5432/ChatHub_DB', {
            logging: false
        });
        
        sequelize.authenticate()
            .then(() => {
              console.log('Connected to PostgreSQL database👌');
            })
            .catch((err) => {
              console.error('Error connecting to PostgreSQL database', err);
            });
    }
    createServer() {
        const http = require("http");
        const server = http.createServer(this.#app);
        server.listen(this.#PORT, () => {
            console.log("Server is running at http://localhost:" + this.#PORT);
        });
    }
    errorHandller(){
        this.#app.use((req, res, next) => {
            next(error.NotFound("url is not find"))
        })
        this.#app.use((err, req, res, next) => {
            const serverError = error.InternalServerError()
            const statusCode = err.status || serverError.status
            const message = err.message || serverError.message
            return res.status(statusCode).json({
                statusCode,
                message
            })
        })
    }
}