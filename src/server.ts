import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as bcrypt from 'bcrypt';

//import routers
import PostRouter from './router/PostRouter';
import UserRouter from './router/UserRouter'; 
import EstatedevRouter from './router/EstatedevRouter';
import EstateleagueRouter from './router/EstateleagueRouter';
import StateRouter from './router/StateRouter';
import LocationRouter from './router/LocationRouter';
import RoleRouter from './router/RoleRouter';
import PropertyRouter from './router/PropertyRouter';
import PaidRouter from './router/PaidRouter';
import EstateRouter from './router/EstateRouter';
import LandRouter from './router/LandRouter';
import EstateDetailsRouter from './router/EstateDetailsRouter';
import TradeRouter from './router/TradeRouter';
import ClientRouter from './router/ClientRouter';



class Server {

    public app: express.Application;

    constructor(){
        this.app = express();
        this.config();
        this.routes();

    }

    public config(){
       // set up mongoose
        // const MONGO_URI = 'mongodb://localhost:27017/blogg';
        // mongoose.connect(MONGO_URI  || process.env.MONGO_URI);
        mongoose.connect("mongodb://localhost:27017/neww",
        { useNewUrlParser: true }).then((res)=>{
            console.log("coonect sucess")
        }
        ).catch(()=>{
            console.log("conect fail");
        });
        

        //config
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(logger('dev'));
        this.app.use('./uploads', express.static('uploads'));
        //this.app.use(express.static('uploads'));

        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
       // this.app.use(bcrypt());

    }

    public routes(): void {
        let router: express.Router;
        router = express.Router();

        this.app.use('/', router);
        this.app.use('/api/v1/posts', PostRouter);
        this.app.use('/api/v1/users', UserRouter);
        this.app.use('/api/v1/estatesleague', EstateleagueRouter);
        this.app.use('/api/v1/estatesdev', EstatedevRouter);
        this.app.use('/api/v1/state', StateRouter);
        this.app.use('/api/v1/location', LocationRouter);
        this.app.use('/api/v1/estate', EstateRouter);
        this.app.use('/api/v1/estatedetails', EstateDetailsRouter);
        this.app.use('/api/v1/role', RoleRouter);
        this.app.use('/api/v1/property', PropertyRouter);
        this.app.use('/api/v1/paid', PaidRouter);
        this.app.use('/api/v1/land', LandRouter);
        this.app.use('/api/v1/trade', TradeRouter);
        this.app.use('/api/v1/client', ClientRouter);




    }
}

//export
export default new Server().app; 