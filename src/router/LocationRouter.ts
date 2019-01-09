import {Router, Request,Response, NextFunction} from 'express';
import Location from '../models/Location';
import State from '../models/State';
const  multer = require('multer');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');



//Set Storage engine
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function (req,file,cb) {
        //cb(null, new Date().toISOString() + file.originalname);
        cb(null, new Date().getTime() + '-' + file.originalname);
       // cb(null,file.fieldname +  '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter  = (req, file, cb)=> {
    //reject a file
    if(file.mimetype  ===  'image/jpeg' || file.mimetype  ===  'image/png'){
        cb(null,true);
    }else{
        cb(null, false);
    }
};
//Init upload
const upload =  multer({
    storage:storage,
    limits: {
        fileSize:1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


class LocationRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }


    public  LocationValidate (req: any, res:Response, next) {
        const schema ={
            name: Joi.string().required(),
            developer: Joi.string().required(),
            plot_size: Joi.string().required(),
            amount: Joi.number().required(),
            bonus: Joi.string().required(),
            slug: Joi.string().required(),

        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            switch(error.details[0].context.key){
                case'name':
                    res.status(400).send({
                        error:'you must provide a valid name'
                    })
                    break
                case 'developer':
                    res.status(400).send({
                        error:'you must provide a valid developer'
                    })
                    break
                case 'plot_size':
                    res.status(400).send({
                        error:'you must provide a valid plot_size'
                    })
                    break
                case 'amount':
                    res.status(400).send({
                        error:'you must provide a numeric value for Amount'
                    })
                    break
                case 'bonus':
                    res.status(400).send({
                        error:'you must provide a valid bonus'
                    })
                    break
                case 'slug':
                    res.status(400).send({
                        error:'you must provide a valid slug'
                    })
                    break
                default:
                    next()
            }
        }else{
            next()

        }

    }

    public CreateLocation (req: any, res:Response):void {

        console.log(req.body)
        console.log(req.file)
        const name: string = req.body.name;
        const slug: string = req.body.slug;
        const plot_size: string = req.body.plot_size;
        const developer: string = req.body.developer;
        const amount: string = req.body.amount;
        const bonus: string = req.body.bonus;
        const state: string = req.body.state;
        const image: string = req.file.path;



        State.findOne({slug:state})
            .then((state:any)=>{
                // console.log(state);
                const state_id = state._id

                const location = new Location({
                    name,
                    slug,
                    developer,
                    plot_size,
                    amount,
                    bonus,
                    state_id,
                    image


                });
                location.save()
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


    public reqHeaderCors(req: Request, res:Response, next):void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }

    public GetLocation(req: Request, res:Response):void {
        Location.find({})
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

    public GetLocationsForState(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        State.findOne({slug})
            .then((state)=>{
                Location.find({ state_id: state._id })
                    .then((locations:any) => {
                        res.json({
                            locations,
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

    public GetLocationsByStateId(req: Request, res:Response):void {
        const _id: number = req.params._id;
        State.findOne({_id})
            .then((state)=>{
                Location.find({ state_id: state._id })
                    .then((locations:any) => {
                        res.json({
                            locations,
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



    routes(){
        this.router.get('/', this.GetLocation);

        this.router.post('/', upload.single('image'),this.reqHeaderCors, this.LocationValidate, this.CreateLocation);
        this.router.get('/getlocations/:slug', this.GetLocationsForState, );
        // this.router.get('/getlocations/:slug', this.GetLocationsForState);



    }
}

//export
const LocationRoutes = new LocationRouter();
LocationRoutes.routes();



export default LocationRoutes.router;