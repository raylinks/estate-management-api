import {Router, Request,Response, NextFunction} from 'express';
import Role from '../models/Role';

class RoleRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetRoles(req: Request, res:Response):void {
        Role.find({})
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
    public GetRole(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Role.findOne({ slug})
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
    public CreateRole(req: Request, res:Response):void {
        const name: string = req.body.name;

        const post = new Role({
            name,

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
        this.router.get('/', this.GetRoles);
        this.router.get('/:slug', this.GetRole);
        this.router.post('/', this.CreateRole);
     

    }
}

//export
const RoleRoutes = new RoleRouter();
RoleRoutes.routes();

//export default ERoledevRoutes.router;
export default RoleRoutes.router;