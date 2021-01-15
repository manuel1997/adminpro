const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

// default options
app.use(fileUpload());

const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

app.put('/:tipo/:id',(req,res,next) =>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    //tipos de coleccion
    tiposValidos = ['hospitales','medicos','usuarios']; 
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status('400').json({
            ok:false,
            mensaje:'Tipo de coleccion no es valida',
            errors:{message:'Tipo de coleccion no es valida'}
        });
    }

    if(!req.files){
        return res.status('400').json({
            ok:false,
            mensaje:'No selecciono nada',
            errors:{message:'No selecciono una imagen'}
        });
    }

    //Obtener nombre del archivo

    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length -1]

    //Extenciones validas
    let extencionesValidas = ['png','jpg','jpeg','gif'];

    if(extencionesValidas.indexOf(extensionArchivo) < 0){

        return res.status('400').json({
            ok:false,
            mensaje:'Extencion no valida',
            errors:{message:'Las extenciones validas son ' + extencionesValidas.join(', ')}
        });

    }

    //Nombre del archivo personalizado
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //MOver el archivo del temporal  al path
    let path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path,err =>{
        if(err){
            return res.status('500').json({
                ok:false,
                mensaje:'Error al mover archivo',
                errors:err
            });
        }

        subirPortTipo(tipo,id,nombreArchivo,res);

    }) 


  
})

function subirPortTipo(tipo,id,nombreArchivo,res){

    if(tipo === 'usuarios'){
        Usuario.findById(id,(err,usuario) =>{

            if(!usuario){
                return res.status('400').json({
                    ok:false,
                    mensaje:'Usuario no existe',
                    errors:{message:'Usuario no existe'}
                });
            }

            let pathViejo = './uploads/usuarios/' + usuario.img;

            //si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err,usuarioActualizado) =>{

                usuarioActualizado.password = ':)'

               return res.status('200').json({
                    ok:true,
                    mensaje:'Imagen de usuario actualizada',
                    usuario:usuarioActualizado
                });
            })
        })
    }

    if(tipo === 'medicos'){
        Medico.findById(id,(err,medico) =>{

            if(!medico){
                return res.status('400').json({
                    ok:false,
                    mensaje:'Medico no existe',
                    errors:{message:'Medico no existe'}
                });
            }

            let pathViejo = './uploads/medicos/' + medico.img;

            //si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err,medicoActualizado) =>{

               return res.status('200').json({
                    ok:true,
                    mensaje:'Imagen de medico actualizada',
                    medico:medicoActualizado
                });
            })
        })

    }

    if(tipo === 'hospitales'){
        Hospital.findById(id,(err,hospital) =>{

            if(!hospital){
                return res.status('400').json({
                    ok:false,
                    mensaje:'Hospital no existe',
                    errors:{message:'Hospital no existe'}
                });
            }

            let pathViejo = './uploads/hospitales/' + hospital.img;

            //si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err,hospitalActualizado) =>{
               return res.status('200').json({
                    ok:true,
                    mensaje:'Imagen de hospital actualizada',
                    hospital:hospitalActualizado
                });
            })
        })
    }
}

module.exports = app;