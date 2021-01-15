const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEDD;

// ===================================
// Verificar Token
//====================================

exports.verificaToken = function(req,res,next){

    token = req.query.token;

    jwt.verify(token,SEED,(err,decoded) =>{

        if(err){
            return res.status('401').json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }
        
        req.usuario = decoded.usuario;

        next();

       /*  res.status('200').json({
            ok: true,
            decoded:decoded
        }); */

    })

}

// ===================================
// Verificar Admin
//====================================

exports.verificaAdmin = function(req,res,next){

   let usuario = req.usuario;

   if(usuario.role === 'ADMIN_ROLE'){
        next();
        return;
   }else{
    return res.status('401').json({
        ok: false,
        mensaje: 'token incorrecto - no es administrador',
        errors: {message:'No es administrador'}
    });
   }

}

// ===================================
// Verificar Admin o mismo usuario
//====================================

exports.verificaMismoUsuario = function(req,res,next){

    let usuario = req.usuario;
    let id = req.params.id
 
    if(usuario.role === 'ADMIN_ROLE' || usuario._id === id  ){
         next();
         return;
    }else{
     return res.status('401').json({
         ok: false,
         mensaje: 'token incorrecto - no es administrador ni es el mismo usuario',
         errors: {message:'No es administrador'}
     });
    }
 
 }