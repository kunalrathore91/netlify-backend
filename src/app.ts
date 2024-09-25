import express from 'express'


const app = express()


app.use(express.json())

app.get('/',(req, res, next)=>{
    return res.json({
        message:"hello yo gesss...",
        status:'2000'
    })
})

app.listen(3000,()=>{
    console.log('app running.....');
    
})