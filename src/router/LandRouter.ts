import {Router, Request,Response, NextFunction} from 'express';
import Land from '../models/Land';
const jwt = require('jsonwebtoken');



'use strict'

process.env.SECRET_KEY = 'secret'

class LandRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }




    public CreateLandSell(req: Request, res:Response):void {
        const decoded = jwt.verify(req.header('token'), process.env.SECRET_KEY);
        console.log(decoded._id);
        const user_id: string = decoded._id;
        const product: string = req.body.product;
        const promo_code:string =  req.body.promo_code;
        const site_visit: string = req.body.site_visit;
        const priviledge: string = req.body.priviledge;


        const land = new Land({
            product,
            promo_code,
            site_visit,
            priviledge,
            user_id
        });
        land.save()
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

       // this.router.post('/authcreatebuy', this.CreateLandBuy);
        this.router.post('/authcreatesell', this.CreateLandSell);


    }
}

//export
const LandRoutes = new LandRouter();
LandRoutes.routes();

export default LandRoutes.router;