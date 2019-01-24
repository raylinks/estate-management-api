import {Router, Request,Response, NextFunction} from 'express';
import State from '../models/State';
import Location from '../models/Location';
const Joi = require('joi');

class StateRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetStates(req: Request, res:Response):void {
        State.find({})
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

    public  StateValidation (req: any, res:Response, next) {
        const schema ={
            state: Joi.string().required(),
            slug: Joi.string().required(),

        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            switch(error.details[0].context.key){
                case'state':
                    res.status(400).send({
                        error:'input  a state'
                    })
                    break
                case 'slug':
                    res.status(400).send({
                        error:'please provide a state for the state'
                    })
                    break
                default:
                    next()
            }
        }else{
            next()

        }

    }



    public CreateState(req: Request, res:Response):void {
        const state: string = req.body.state;
        const slug: string = req.body.slug;
        const post = new State({
            state,
            slug
            
        });
        post.save()
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

    public DeleteState(req: Request, res:Response):void {
        const id: number = req.params._id;
        State.findOneAndRemove({ id})
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
        this.router.get('/', this.GetStates);
        this.router.post('/',this. StateValidation, this.CreateState);
        this.router.delete('/:_id', this.DeleteState);
     

    }
}

//export
const StateRoutes = new StateRouter();
StateRoutes.routes();

//export default EstatedevRoutes.router;
export default StateRoutes.router;