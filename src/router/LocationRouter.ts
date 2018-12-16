import {Router, Request,Response, NextFunction} from 'express';
import Location from '../models/Location';
import State from '../models/State';

class LocationRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetPosts(req: Request, res:Response):void {
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
    public GetPost(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Location.findOne({ slug})
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
    public CreateLocation(req: Request, res:Response):void {
        const name: string = req.body.name;
        const slug: string = req.body.slug;
        const plot_size: string = req.body.plot_size;
        const developer: string = req.body.developer;
        const amount: string = req.body.amount;
        const bonus: string = req.body.bonus;
        const state: string = req.body.state;
        State.findOne({slug:state})
        .then((state:any)=>{
            console.log(state);
            const state_id = state._id
            
            const location = new Location({
                name,
                slug,
                developer,
                plot_size,
                amount,
                bonus,
                state_id,                
                
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
    
     

    routes(){
        this.router.get('/', this.GetPosts);
        this.router.get('/:slug', this.GetPost);
        this.router.post('/', this.CreateLocation);
        this.router.post('/getLocations/:slug', this.GetLocationsForState);
        
     

    }
}

//export
const LocationRoutes = new LocationRouter();
LocationRoutes.routes();

//export default EstatedevRoutes.router;
export default LocationRoutes.router;