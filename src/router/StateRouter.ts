import {Router, Request,Response, NextFunction} from 'express';
import State from '../models/State';
import Location from '../models/Location';

class StateRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetPosts(req: Request, res:Response):void {
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
    public GetPost(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        State.findOne({ slug})
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

    
    
     

    routes(){
        this.router.get('/', this.GetPosts);
        this.router.get('/:slug', this.GetPost);
        this.router.post('/', this.CreateState);
     

    }
}

//export
const StateRoutes = new StateRouter();
StateRoutes.routes();

//export default EstatedevRoutes.router;
export default StateRoutes.router;