import {Router, Request,Response, NextFunction} from 'express';

import Client from '../models/Client';
const jwt = require('jsonwebtoken');
import { Promise } from 'mongoose';
// import nodemailer from 'nodemailer';
const Joi = require('joi');
const nodemailer = require('nodemailer');
const fs = require('fs');


'use strict'

process.env.SECRET_KEY = 'secret'


const schema = {
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // pasword_confirmation: Joi.any().equal(Joi.ref('password')).required()
    product: Joi.string().required(),
    site_visit:  Joi.string().alphanum().required(),
    promo_code: Joi.string().required(),
    phone:  Joi.string().alphanum().required()

}



class ClientRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }


    public CreateProduct(req: Request, res:Response):void {
        // const token = ;
        // const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.dir(decoded.email);
        const product_name: string = req.body.params.product_name;
        const promo_code: string = req.body.params.promo_code;
        const inspection: string = req.body.params.inspection;
        // const user: string =decoded.email;
        console.dir(req);
        const user: string =   jwt.verify(req.body.headers.Authorization.split(" ")[1], process.env.SECRET_KEY).email;

        const client = new Client({
            product_name,
            promo_code,
            inspection,
            user,


        });
        client.save()
            .then((data) => {
                const status = res.statusCode;
                res.json({
                    status,

                });
            }) .catch((err)=> {
            const status = res.statusCode;
            res.json({
                status,
                err
            });
        });

    }
    public GetProduct(req: Request, res:Response):void {

        Client.find({})
            .then((data) => {
                const status = res.statusCode;
                res.json({
                    status,
                    data
                });

            })
            .catch((err)=> {
                const status = res.statusCode;
                res.json({
                    status,
                    err
                });
            })
    }



    routes(){

        this.router.post('/', this.CreateProduct);
        this.router.get('/', this.GetProduct);



    }
}

//export
const ClientRoutes = new ClientRouter();
ClientRoutes.routes();

export default ClientRoutes.router;