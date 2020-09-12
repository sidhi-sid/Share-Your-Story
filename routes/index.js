const express=require('express')
const router=express.Router()
require('../views/login.hbs')


router.get('/',(req,res)=>{
    res.render('login',{
        layout:'login'
    });
})

router.get('/dashboard',(req,res)=>{
    res.render('dashboard');
})

module.exports=router