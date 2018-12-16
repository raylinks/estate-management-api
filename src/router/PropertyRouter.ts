import {Router, Request,Response, NextFunction} from 'express';
import Property from '../models/Property';

class PropertyRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetProperties(req: Request, res:Response):void {
        Property.find({})
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
    public GetProperty(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Property.findOne({ slug})
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
// public create(req:Request,res:Response){
//     const description:string =req.body.description;
//     const name:string = req.body.name;
//     const prop = new Property({
//         description,
//         name
//     });
//     prop.save()
//     .then((data)=>{

//     })
//     .catch((err)=>{

//     })

// }

    public CreateProperty(req: Request, res:Response):void {
        const description:string = req.body.description;
        
        const fullname: string = req.body.fullname;
        const email: string = req.body.email;
        const phone: string = req.body.phone;

        const property = new Property({
            description,
            fullname,
            email,
            phone
        });
        property.save()
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
    public UpdateProperty(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Property.findOneAndUpdate({ slug}, req.body)
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
    public DeleteProperty(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Property.findOneAndRemove({ slug})
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
        this.router.get('/', this.GetProperties);
        this.router.get('/:slug', this.GetProperty);
        this.router.post('/', this.CreateProperty);
        this.router.put('/:slug', this.UpdateProperty);
        this.router.delete('/:slug', this.DeleteProperty);

    }
}

//export
const PostRoutes = new PropertyRouter();
PostRoutes.routes();

export default PostRoutes.router;