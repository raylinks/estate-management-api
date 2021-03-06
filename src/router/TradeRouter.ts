import {Router, Request,Response, NextFunction} from 'express';

import Trade from '../models/Trade';

import { Promise } from 'mongoose';
// import nodemailer from 'nodemailer';
const Joi = require('joi');
const nodemailer = require('nodemailer');
const fs = require('fs');


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



class TradeRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetTrade(req: Request, res:Response):void {

        Trade.find({})
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

    public CreateTrade(req: Request, res:Response):void {
        const firstname: string = req.body.firstname;
        const lastname: string = req.body.lastname;
        const phone: string = req.body.phone;
        const product: string = req.body.product;
        const promo_code: string = req.body.promo_code;
        const inspection: string = req.body.inspection;
        const trade = new Trade({
            firstname,
            lastname,
            phone,
            product,
            promo_code,
            inspection,

        });
        trade.save()
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
            });
    }


    routes(){
        this.router.get('/', this.GetTrade);
        this.router.post('/', this.CreateTrade);



    }
}

//export
const TradeRoutes = new TradeRouter();
TradeRoutes.routes();

export default TradeRoutes.router;