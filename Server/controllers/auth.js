import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import { request } from "express";

export const signup = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash});
        
        await newUser.save();
        res.status(200).send("new user is created successfully");
    }catch(err){
        next(err);
    }
};

export const signin = async (req, res, next) => {
    try{
        const user = await User.findOne({name: req.body.name});
        if(!user) return next(createError(404, "User not found!"));

        const isCorrected = await bcrypt.compare(req.body.password, user.password); 
        if(!isCorrected) return next(createError(400, "Invalid password!"));
        const {password, ...others} = user._doc; // hide the detail of the account.
        
        // Create access token for the signed in user:
        const token = jwt.sign({id: user._id}, process.env.JWT);
        res.cookie("access_token", token,{
            httpOnly: true
        }).status(200).json(others)
    }catch(err){
        next(err);
    }
};

export const googleAuth = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT);
            res.cookie("access_token", token,{
                httpOnly: true
            }).status(200).json(user._doc);
        }else{
            const newUser = new User({
                ...req.body,
                fromGoogle: true,
            })
            const saveUser = await newUser.save();
            const token = jwt.sign({id: saveUser._id}, process.env.JWT);
            res.cookie("access_token", token,{
                httpOnly: true
            }).status(200).json(saveUser._doc);
        }
    }catch(err){
        next(err);
    }
}
