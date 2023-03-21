import { Router } from 'express';
const router = Router();
import { getAllCountrys, setCountry ,deleteCountry} from '../controllers/views.controllers.js';



router.get('/' ,getAllCountrys,(req,res)=>{})

router.get('/crear',(req,res)=>{
    res.render('create',{
        title : 'agregar pais'
    })
})
.post('/crear',setCountry,(req,res)=>{})

router.get('/eliminar',(req,res)=>{
    res.render('delete',{
        title : 'eliminar pais'
    })
})
.delete('/eliminar/:nombre',deleteCountry,(req,res)=>{})

export default router;