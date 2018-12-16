import {Router, Request,Response, NextFunction} from 'express';
import Estatedev from '../models/Estatedev';

class EstatedevRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public Getdev(req: Request, res:Response):void {
        Estatedev.find({})
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
    public GetdevById(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Estatedev.findOne({ slug})
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
    public Createdev(req: Request, res:Response):void {
        const state_id: string[] = req.body.state_id;
        const slug: string = req.body.slug;
        const location: string = req.body.location;
        const developer: string = req.body.developer;
        const plot_size: string = req.body.plot_size;
        const amount: string = req.body.amount;
        const bonus: string = req.body.bonus;

        const post = new Estatedev({
            state_id,
            slug,
            location,
            bonus,
            developer,
            plot_size,
            amount,
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
    public UpdatePost(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Estatedev.findOneAndUpdate({ slug}, req.body)
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
    public DeletePost(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Estatedev.findOneAndRemove({ slug})
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
        this.router.get('/', this.Getdev);
        this.router.get('/:slug', this.GetdevById);
        this.router.post('/', this.Createdev);
        this.router.put('/:slug', this.UpdatePost);
        this.router.delete('/:slug', this.DeletePost);

    }
}

//export
const EstatedevRoutes = new EstatedevRouter();
EstatedevRoutes.routes();

//export default EstatedevRoutes.router;
export default EstatedevRoutes.router;