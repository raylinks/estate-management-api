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
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    // pasword_confirmation: Joi.any().equal(Joi.ref('password')).required()
    product: Joi.string().required(),
    site_visit:  Joi.string().alphanum().required(),
    promo_code: Joi.string().required(),
    phone:  Joi.string().alphanum().required()

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
        const username: string = req.params.username;
        User.findOne({ username}).populate('posts', 'tile', 'content')
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


    public CreateUser(req: Request, res:Response):void {
        const result = Joi.validate(req.body,schema);

        if(result.error == null){
            Role.findOne({name:'user'})
                .then((role)=>{
                    const userData = {
                        firstname: result.value.firstname,
                        lastname:  result.value.lastname,
                        username:  result.value.username,
                        email:  result.value.email,
                        password: result.value.password,
                        phone:  result.value.phone,
                        role_id: role._id,
                        product: result.value.product,
                        promo_code: result.value.promo_code,
                        site_visit: result.value.site_visit
                        //const posts: string[]  = req.body.posts;
                    }
                    User.findOne({
                        email: result.value.email
                    }).then(user =>{
                        if(!user){
                            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                                userData.password = hash
                                User.create(userData)
                                    .then((user:any)=> {
                                        const transporter = nodemailer.createTransport({
                                            service: "gmail",
                                            auth:{
                                                user: 'olawuyirilwan98@gmail.com',
                                                pass: "history99"
                                            }
                                        })
                                        const mailOptions = {
                                            from: 'raymond@gmail.com',
                                            to: user.email,
                                            subject: 'Registration successful',
                                            text:'registered you '+ user.email,
                                            // html: fs.createReadStream('content.html')
                                        }
                                        const adminOptions = {
                                            from: 'raymond@gmail.com',
                                            to: "admin@gmail.com",
                                            subject: 'Registration successful',
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

        }else {
            res.status(500).send({error:result.error});
        }

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
                    service: "gmail",
                    auth:{
                        user: 'olawuyirilwan98@gmail.com',
                        pass: "history99"
                    }
                })
                const mailOptions = {
                    from: 'raymond@gmail.com',
                    to: user.email,
                    subject: 'Registration successful',
                    html:'Click this link to reset your password <a href="www://teamltd.org/#/resetpassword?token='+token+'">link</a>'
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
                if(user){
                    if(bcrypt.compare(req.body.password, user.comparePassword)){
                        const payload ={
                            _id:user.id,
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY,{
                            expiresIn:1440
                        })
                        res.send({firstname:user.firstname,
                            lastname:user.lastname,
                            email:user.email,
                            paid_status: (user.is_payed == payStatus.paid) ? true : false,
                            role:user.role_id.name,token})
                    }else{
                        res.status(401).send({error: 'Invalid password'})
                    }
                }else{
                    res.status(401).send({success: 'User doesn\'t exist'})
                }
            })
            .catch(err => {
                res.send('error:' + err)
            })
    }
    // public UpdateUser(req: Request, res:Response):void {
    //     const username: string = req.params.username;
    //     User.findOneAndUpdate({ username}, req.body)
    //     .then((data) => {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             data
    //         });

    //     })
    //      .catch((err)=> {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             err
    //         });
    //     })
    // }
    // public DeleteUser(req: Request, res:Response):void {
    //   const username: string = req.params.username;
    //     User.findOneAndRemove({ username})
    //     .then((data) => {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             data
    //         });

    //     })
    //      .catch((err)=> {
    //         const status = res.statusCode;
    //         res.json({
    //             status,
    //             err
    //         });
    //     })

    // }

    routes(){
        this.router.get('/', this.GetUsers);
        this.router.post('/login', this.LoginUser);
        this.router.get('/:username', this.GetUser);
        this.router.post('/', this.CreateUser);
        this.router.post('/role', this.UpdateUserRole);
        this.router.post('/forget', this.ForgetPassword);
        this.router.post('/reset', this.ResetPassword)


    }
}

//export
const UserRoutes = new UserRouter();
UserRoutes.routes();

export default UserRoutes.router;