import {Router, Request,Response, NextFunction} from 'express';
import Paid from '../models/Paid';

class PaidRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetAllPaid(req: Request, res:Response):void {
        Paid.find({})
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
    public GetPay(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Paid.findOne({ slug})
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
    public CreatePay(req: Request, res:Response):void {  
        const payment: string = req.body.payment;
        const bonus: string = req.body.bonus;
        const allocation: string = req.body.allocation;

        const users = new Paid({
            payment,
            bonus,
            allocation,
    
        });
        users.save()
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
    public UpdatePaid(req: Request, res:Response):void {
        const slug: string = req.params.slug;
        Paid.findOneAndUpdate({ slug}, req.body)
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
        this.router.get('/', this.GetAllPaid);
        this.router.get('/:slug', this.GetPay);
        this.router.post('/', this.CreatePay);
        this.router.put('/:slug', this.UpdatePaid);
      

    }
}

//export
const PaidRoutes = new PaidRouter();
PaidRoutes.routes();

export default PaidRoutes.router;