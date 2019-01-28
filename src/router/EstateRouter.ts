import {Router, Request,Response, NextFunction} from 'express';
import Estate from '../models/Estate';
import State from '../models/State';
const Joi = require('joi');

class EstateRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetEstate(req: Request, res:Response):void {
        Estate.find({})
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

    public  EstateValidation (req: any, res:Response, next) {
        const schema ={
            name: Joi.string().required(),
            slug: Joi.string().required(),

        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            switch(error.details[0].context.key){
                case'name':
                    res.status(400).send({
                        error:'input  an estate'
                    })
                    break
                case 'slug':
                    res.status(400).send({
                        error:'please provide a slug for the estate'
                    })
                    break
                default:
                    next()
            }
        }else{
            next()

        }

    }



    public CreateEstate(req: any, res:Response):void {
        const name: string = req.body.name;
        const slug: string = req.body.slug;
        const state: string = req.body.state;
        State.findOne({slug:state})
            .then((state:any)=>{
                // console.log(state);
                const state_id = state._id
                const estate = new Estate({
                    name,
                    slug,
                    state_id,
                });
                estate.save()
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
            })
            .catch(err=>{
                res.json(err);
                console.log(err);

            })
    }

    public GetEstateForState(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        State.findOne({slug})
            .then((state)=>{
                Estate.find({ state_id: state._id })
                    .then((estates:any) => {
                        res.json({
                            estates,
                            status:"success"
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.json(err)
                    })
            })
            .catch(err=>{
                res.json(err)
                console.log(err);
            })
    }


    public DeleteEstate(req: Request, res:Response):void {
        const id: number = req.params._id;
        Estate.findOneAndRemove({ id})
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
        this.router.get('/', this.GetEstate);
        this.router.post('/',this. EstateValidation, this.CreateEstate);
        this.router.get('/getestates/:slug', this.GetEstateForState);
        this.router.delete('/:_id', this.DeleteEstate);


    }
}

//export
const EstateRoutes = new EstateRouter();
EstateRoutes.routes();

//export default EstatedevRoutes.router;
export default EstateRoutes.router;