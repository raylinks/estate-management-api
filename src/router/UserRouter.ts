import {Router, Request,Response, NextFunction} from 'express';
import User, {payStatus} from '../models/User';
import Role from '../models/Role';

import { Promise } from 'mongoose';
import { userInfo } from 'os';
// import nodemailer from 'nodemailer'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const fs = require('fs')


const schema = {
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string(),
    pasword_confirmation: Joi.any().equal(Joi.ref('password')).required(),
    product: Joi.string().required(),
    priviledge: Joi.string().required(),
    //site_visit: Joi.string().required(),
    promo_code: Joi.string().required(),
    description: Joi.string().required(),
    phone:  Joi.string().required(),
    
}



'use strict'

process.env.SECRET_KEY = 'secret'

class UserRouter{
    router :Router;
    constructor(){
        this.router =Router();
        this.routes();
    }

    public GetUsers(req: Request, res:Response):void {

        User.find({})
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
    
    public GetUser(req: Request, res:Response):void {
        const _id: number = req.params._id;
        User.findOne({ _id})
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

    public getTradeBuyers (req:Request, res:Response){
        User.find({priviledge:1})
            .then((data) =>{
                const status = res.statusCode;
                res.json({
                status,
                data
                })
            })
            .catch((err) =>{
                const status = res.statusCode;
                res.json({
                    status,
                    err
                })
            })

    }

    public getTradeSellers (req:Request, res:Response){
        User.find({priviledge:2})
            .then((data) =>{
                const status = res.statusCode;
                res.json({
                    status,
                    data
                })
            })
            .catch((err) =>{
                const status = res.statusCode;
                res.json({
                    status,
                    err
                })
            })

    }

    // public getUserDetails(req: Request, res: Response){
    //
    //     const decoded = jwt.verify(req.header('token'), process.env.SECRET_KEY);
    //     console.log(decoded._id);
    //
    // }

    
    public CreateUser(req: Request, res:Response):void {

            Role.findOne({name:'user'})
            .then((role)=>{
                const userData = {
                    firstname: req.body.firstname,
                    lastname:  req.body.lastname,
                    username:  req.body.username,
                    email:  req.body.email,
                    password: req.body.password,
                    phone:  req.body.phone,
                    role_id: role._id,
                    product: req.body.product,
                    promo_code: req.body.promo_code,
                    site_visit: req.body.site_visit

                //const posts: string[]  = req.body.posts;
                }
                User.findOne({
                    email: req.body.email
                }).then(user =>{
                    if(!user){
                        bcrypt.hash(req.body.password, 10, (err, hash)=>{
                            userData.password = hash
                            console.log(hash)
                            User.create(userData)
                            .then((user:any)=> {
                                const transporter = nodemailer.createTransport({
                                    service: "teamltd.org",
                                    auth:{
                                        user: 'communications@teamltd.org',
                                        pass: "history99"
                                    }
                                })
                                const mailOptions = {
                                    from: 'T.E.A.M LTD',
                                    to: user.email,
                                    subject: 'Registration successful',
                                    text:'registered you '+ user.email,
                                    // html: fs.createReadStream('content.html')
                                }
                                const adminOptions = {
                                    from: 'T.E.A.M LTD',
                                    to: "communications@teamltd.org",
                                    subject: 'user.firstname has registered',
                                    text:'user.firstname is now part of us '+ user.email
                                }
                                transporter.sendMail(mailOptions,(err,info)=>{
                                    console.log(err);
                                })
                                transporter.sendMail(adminOptions,(err,info)=>{
                                    console.log(err);                                    
                                })
                                
                                res.json({status: user.email + ' registered'})
                            })
                            .catch(err =>{
                                res.send('error: '+ err)
                            })
                        })
                    }else{
                        res.json({error: 'User already exist'})
        
                    }
                })
                .catch(err => {
                    res.send('error:' + err)
                })
            })
            .catch(err=>{
                res.status(500).send(err);
            })

    }

    public UpdateUserRole(req: Request, res:Response):void {
        Role.findOne({name:req.body.role})
        .then((role)=>{
            User.update({email:req.body.email},{role_id:role._id},()=>{
                res.json({status:'updated',email:req.body.email})
            });
        })
        .catch(err => {
                res.send('error:' + err)
        })     
    }

    public UpdatePaidUser(req: Request, res:Response):void {
        User.update({email:req.body.email},{is_payed:(req.body.paid_status === 'paid') ? payStatus.paid : payStatus.unpaid},(err,raw)=>{
            if(!err)
             res.json({status:'updated',email:req.body.email})
            else
            res.status(500).send({status:'error', messgae: JSON.stringify(err)})
        });  
    }

   public ResetPassword(req:Request, res:Response){
    User.findOne({forget_pass_token:req.body.token},(err,user:any)=>{
        if(user != null){
            if(req.body.password === req.body.confirm_password){
                bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    user.password = hash
                    user.forget_pass_token = null
                    user.save((err)=>{
                        if(err){
                            res.status(401).send({error:"Unable to change password"})
                        }
                        else{
                            res.status(200).send({success:"Password changed successfully"})
                        }
                    })
                })
            }
            else{
                res.status(401).send({error:"Password mismatch"})
            }
            
        }
        else{
            res.status(401).send({error:"Invalid token"})
        }
    })
   }
    public ForgetPassword(req: Request, res:Response){
                const token = Math.random().toString(36).substr(0,20);
                console.log(token);
                
                User.findOneAndUpdate({email:req.body.email},{forget_pass_token:token},(err,user:any)=>{
                    if(user !== null){
                        const transporter = nodemailer.createTransport({
                            service: "teamltd.org",
                            auth:{
                                user: 'support@teamltd.org',
                                pass: "history99"
                            }
                        })
                        const mailOptions = {
                            from: 'raymond@gmail.com',
                            to: user.email,
                            subject: 'forget password',
                            html:'Click this link to reset your password <a href="http://teamltd.org/resetpassword?token='+token+'">LINK</a>'
                        }
                        transporter.sendMail(mailOptions,(err,info)=>{
                            console.log(err);
                            console.log(info);
                        })
                        res.json({status:'updated',email:req.body.email})
                    }
                    else{
                        res.status(401).send({error:"User doesn't exist"})
                        console.log(err);
                        
                    }
                })

                    
                        
    }



    public LoginUser(req: Request, res:Response):void {
        User.findOne({
            email: req.body.email
        }).populate('role_id')
        .then((user:any) => {
            console.log(user)
            console.log(req.body)
            if(user){
                if(bcrypt.compareSync(req.body.password, user.password)){
                    console.log(user.password)
                    const payload ={
                        _id:user.id,
                    };
                    let token = jwt.sign(payload, process.env.SECRET_KEY,{
                        expiresIn:1440
                    });
                    res.send({user:{firstname:user.firstname,
                        lastname:user.lastname,
                        email:user.email,
                        paid_status: (user.is_payed == payStatus.paid) ? true : false,
                        role:user.role_id.name},token})
                }
                else{
                    res.status(401).send({error: 'Invalid password'})
                }
            }else{
                res.status(401).send({error: 'User doesn\'t exist'})
            }
        })
        .catch(err => {
            res.send('error:' + err)
        })
     }



    public  TradeBuyValidation (req: any, res:Response, next) {
        const schema ={

            product: Joi.string().required(),
            promo_code: Joi.string(),
            site_visit: Joi.string().required(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }),
            password: Joi.string().required(),
            password_confirmation: Joi.any().equal(Joi.ref('password')).required(),
            phone: Joi.number().required(),
            priviledge: Joi.number().required(),

        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            console.log(error.details)
            switch(error.details[0].context.key){
                case 'product':
                    res.status(400).send({
                        error:'you must provide a valid product'
                    })
                    break
                case 'promo_code':
                    res.status(400).send({
                        error:'you must select a promo code'
                    })
                    break
                case 'priviledge':
                    res.status(400).send({
                        error:'you must select a  priviledge'
                    })
                    break

                case 'site_visit':
                    res.status(400).send({
                        error:'you must provide a date for site visit'
                    })
                    break
                case'firstname':
                    res.status(400).send({
                        error:'input  your firstname'
                    })
                    break

                case 'lastname':
                    res.status(400).send({
                        error:'please provide your username'
                    })
                    break
                case 'email':
                    res.status(400).send({
                        error:'you must provide a valid email address'
                    })
                    break
                case 'password':
                    res.status(400).send({
                        error:'you must provide a valid password'
                    })
                    break
                case 'password_confirmation':
                    res.status(400).send({
                        error:'confirm password doeznt match your password'
                    })
                    break
                case 'phone':
                    res.status(400).send({
                        error:'endeavour to provide a valid numeric digits for mobile number'
                    })
                    break

                default:
                    console.log(error.details)
                    res.status(400).send({
                        error:'Invalid information'
                    })
                    break
            }
        }else{
            next()

        }

    }



    public CreateTradeBuy(req: Request, res:Response):void {
            Role.findOne({name:'user'})
                .then((role)=>{
                    const userData = {
                        firstname: req.body.firstname,
                        lastname:  req.body.lastname,
                        email:  req.body.email,
                        password: req.body.password,
                        phone:  req.body.phone,
                        role_id: role._id,
                        priviledge: req.body.priviledge,
                        product: req.body.product,
                        promo_code: req.body.promo_code,
                        site_visit: req.body.site_visit
                        //const posts: string[]  = req.body.posts;
                    }
                    User.findOne({
                        email: req.body.email
                    }).then(user =>{
                        if(!user){
                            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                                userData.password = hash
                                User.create(userData)
                                    .then((user:any)=> {
                                        const transporter = nodemailer.createTransport({
                                            host: "mail.teamltd.org",
                                            port: 25,
                                            secure:false,
                                            auth:{
                                                user: 'communications@teamltd.org',
                                                pass: "srayimd0"
                                            }
                                        })
                                        const mailOptions = {
                                            from: 'communications@estateleague.org',
                                            to: user.email,
                                            subject: 'Registration successful',
                                            text:'registered you '+ user.email,
                                            // html: fs.createReadStream('content.html')
                                        }
                                        const adminOptions = {
                                            from: 'communications@estateleague.org',
                                            to: "communications@estateleague.org",
                                            subject: 'a client just registered to buy a  land',
                                            text:'registered you '+ user.email
                                        }
                                        transporter.sendMail(mailOptions,(err,info)=>{
                                            console.log(err);
                                        })
                                        transporter.sendMail(adminOptions,(err,info)=>{
                                            console.log(err);
                                        })

                                        res.json({status: user.email + ' registered'})
                                    })
                                    .catch(err =>{
                                        res.send('error: '+ err)
                                    })
                            })
                        }else{
                            res.json({error: 'User already exist'})

                        }
                    })
                        .catch(err => {
                            res.send('error:' + err)
                        })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).send(err);
                })

    }



    public  TradeSellValidation (req: any, res:Response, next) {
        const schema ={
            product: Joi.string().required(),
            promo_code: Joi.string().required(),
            site_visit: Joi.string().required(),
            refelname: Joi.string().required(),
            refelemail: Joi.string().email({ minDomainAtoms: 2 }),
            refelphone: Joi.number().required(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }),
            password: Joi.string().required(),
            password_confirmation: Joi.any().equal(Joi.ref('password')).required(),
            phone: Joi.number().required(),
            priviledge: Joi.number().required(),


        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            switch(error.details[0].context.key){
                case 'product':
                    res.status(400).send({
                        error:'you must select a product'
                    })
                    break
                case 'promo_code':
                    res.status(400).send({
                        error:'you must provide a valid promo code'
                    })
                    break
                case 'priviledge':
                    res.status(400).send({
                        error:'you must provide a priviledge'
                    })
                    break
                case 'site_visit':
                    res.status(400).send({
                        error:'you must provide a valid date'
                    })
                    break
                case'refelname':
                    res.status(400).send({
                        error:'please provide your referal name'
                    })
                    break
                case'refelemail':
                    res.status(400).send({
                        error:'please provide your referal email'
                    })
                    break
                case'refelphone':
                    res.status(400).send({
                        error:'please provide your referal phone number'
                    })
                    break
                case'firstname':
                    res.status(400).send({
                        error:'please provide your firstname'
                    })
                    break
                case 'lastname':
                    res.status(400).send({
                        error:'please provide your lastname'
                    })
                    break

                case 'email':
                    res.status(400).send({
                        error:'you must provide a valid email address'
                    })
                    break
                case 'password':
                    res.status(400).send({
                        error:'you must provide a valid password'
                    })

                    break
                case 'password_confirmation':
                    res.status(400).send({
                        error:'confirm password doeznt match your password'
                    })
                    break
                case 'phone':
                    res.status(400).send({
                        error:'you must provide  numeric digits for mobile number'
                    })
                    break

                default:
                    console.log(error.details)
                    res.status(400).send({
                        error:'Invalid information'
                    })
                    break
            }
        }else{
            next()

        }

    }


    public CreateTradeSell(req: Request, res:Response):void {

            Role.findOne({name:'user'})
                .then((role)=>{
                    const userData = {
                        firstname: req.body.firstname,
                        lastname:  req.body.lastname,
                        email:  req.body.email,
                        password: req.body.password,
                        phone:  req.body.phone,
                        role_id: role._id,
                        product: req.body.product,
                        priviledge:req.body.priviledge,
                        promo_code: req.body.promo_code,
                        refelname: req.body.refelname,
                        refelemail: req.body.refelemail,
                        refelphone: req.body.refelphone,
                        //const posts: string[]  = req.body.posts;
                    }
                    User.findOne({
                        email: req.body.email
                    }).then(user =>{
                        if(!user){
                            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                                userData.password = hash
                                User.create(userData)
                                    .then((user:any)=> {
                                        const transporter = nodemailer.createTransport({
                                            service: "teamltd.org",
                                            auth:{
                                                user: 'communications@teamltd.org',
                                                pass: "srayimd0"
                                            }
                                        })
                                        const mailOptions = {
                                            from: 'T.E.A.M LTD',
                                            to: user.email,
                                            subject: 'Registration successful',
                                            text:'Thanks You for been part of us '+ user.email,
                                            // html: fs.createReadStream('content.html')
                                        }
                                        const adminOptions = {
                                            from: 'T.E.A.M LTD',
                                            to: "support@teamltd.org",
                                            subject: 'A client is about to sell a Property',
                                            text:'registered you '+ user.email
                                        }
                                        transporter.sendMail(mailOptions,(err,info)=>{
                                            console.log(err);
                                        })
                                        transporter.sendMail(adminOptions,(err,info)=>{
                                            console.log(err);
                                        })

                                        res.json({status: user.email + ' registered'})
                                    })
                                    .catch(err =>{
                                        res.send('error: '+ err)
                                    })
                            })
                        }else{
                            res.json({error: 'User already exist'})

                        }
                    })
                        .catch(err => {
                            res.send('error:' + err)
                        })
                })
                .catch(err=>{
                    res.status(500).send(err);
                })
    }

    public  ContactUs (req: any, res:Response, next) {
        const schema ={
            name: Joi.string().required(),
            email: Joi.string().email({ minDomainAtoms: 2 }),
            subject: Joi.string().required(),
            message: Joi.string().required(),

        }
        const{error,value} = Joi.validate(req.body, schema)
        if(error){
            switch(error.details[0].context.key){
                case'name':
                    res.status(400).send({
                        error:'input  your fullname'
                    })
                    break
                case 'email':
                    res.status(400).send({
                        error:'you must provide a valid email address'
                    })

                    break
                case 'subject':
                    res.status(400).send({
                        error:'endeavour to write a subject of your message'
                    })
                    break
                case 'message':
                    res.status(400).send({
                        error:'endeavour to write a message to us'
                    })
                    break
                default:
                    next()
            }
        }else{
            next()

        }

    }





    public UpdateUser(req: Request, res:Response):void {
        const _id: string = req.params._id;
        User.findOneAndUpdate({ _id}, req.body)
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
    public DeleteUser(req: Request, res:Response):void {
      const id: number = req.params._id;
        User.findOneAndRemove({ id})
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
         this.router.get('/', this.GetUsers);
        this.router.post('/login', this.LoginUser);
        this.router.get('/tradebuyers', this.getTradeBuyers);
        this.router.get('/tradesellers', this.getTradeSellers);
        this.router.put('/:_id', this.UpdateUser);
        this.router.get('/:_id', this.GetUser);
        this.router.delete('/:_id', this.DeleteUser);


        this.router.post('/createtradebuy',this.TradeBuyValidation, this.CreateTradeBuy);
        this.router.post('/createtradesell',this.TradeSellValidation, this.CreateTradeSell);
        this.router.post('/', this.CreateUser);

        this.router.post('/role', this.UpdateUserRole);
        this.router.post('/forget', this.ForgetPassword);
        this.router.post('/reset', this.ResetPassword);
        this.router.post('/contact', this.ContactUs);
        //this.router.get('/details', this.getUserDetails);

    }
}

//export
const UserRoutes = new UserRouter();
UserRoutes.routes();

export default UserRoutes.router;