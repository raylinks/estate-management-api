import {Router, Request,Response, NextFunction} from 'express';
import Estateleague from '../models/Estateleague';

class EstateleagueRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetLeagues(req: Request, res:Response):void {
        Estateleague.find({})
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
    public GetLeague(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Estateleague.findOne({ slug})
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
    public CreateLeague(req: Request, res:Response):void {
        const product: string = req.body.product;
        const slug: string = req.body.slug;
        const inspection_date: string = req.body.inspection_date;
        

        const estateleague = new Estateleague({
            product,
            slug,
            inspection_date
        });
        estateleague.save()
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
    // public UpdatePost(req: Request, res:Response):void {
    //     const slug: string = req.params.slug;
    //     Post.findOneAndUpdate({ slug}, req.body)
    //     .then((data) => {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             data
    //         });

    //     })
    //     .catch((err)=> {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             err
    //         });
    //     })

        
    // }
    // public DeletePost(req: Request, res:Response):void {
    //     const slug: string = req.params.slug;
    //     Post.findOneAndRemove({ slug})
    //     .then((data) => {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             data
    //         });

    //     })
    //     .catch((err)=> {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             err
    //         });
    //     })
        
    // }

    routes(){
        this.router.get('/', this.GetLeagues);
        this.router.get('/:slug', this.GetLeague);
        this.router.post('/', this.CreateLeague);
        // this.router.put('/:slug', this.UpdatePost);
        // this.router.delete('/:slug', this.DeletePost);

    }
}

//export
const EstateleagueRoutes = new EstateleagueRouter();
EstateleagueRoutes.routes();

export default EstateleagueRoutes.router;