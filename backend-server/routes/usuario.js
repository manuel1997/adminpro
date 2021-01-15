const express = require('express');
const bcrypt = require('bcryptjs');

mdAuntenticacion = require('../middlewares/autenticacion');

const app = express();

const Usuario = require('../models/usuario');


// ===================================
// Obtener todos los usuarios
//====================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err)
                    return res.status('500').json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });

                    Usuario.count({},(err,conteo)=>{
                        res.status('200').json({
                            ok: true,
                            usuarios: usuarios,
                            total:conteo
                        });
                    })

              

            })



})


// ===================================
// Actualizar usuario
//====================================

app.put('/:id', [ mdAuntenticacion.verificaToken,mdAuntenticacion.verificaMismoUsuario], (req, res) => {

    const id = req.params.id
    const body = req.body;

        Usuario.findById(id, (err, usuario) => {
        
            if (err){ 
                return res.status('500').json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if(!usuario){
                return res.status('400').json({
                    ok: false,
                    mensaje: 'El usaurio no existe',
                    errors: {messaje:'no existe un usario con ese id'}
                });
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save( (err, usuarioGuardado) => {

                if(err){
                return res.status('400').json({
                    ok: false,
                    mensaje: 'Error al actuaizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ":)"

                res.status('200').json({
                    ok: true,
                    usuario:usuarioGuardado
                });

            });
        
    });     
  
})


// ===================================
// Insertar usuarios
//====================================

app.post('/', (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if (err){ 
            return res.status('400').json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status('201').json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken:req.usuario
        });
    })

  
})

// ===================================
// Eliminar usuario por el id
//====================================

app.delete('/:id',  [ mdAuntenticacion.verificaToken,mdAuntenticacion.verificaAdmin], (req,res) =>{

    const id = req.params.id

        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

            if (err){ 
                return res.status('500').json({
                    ok: false,
                    mensaje: 'Error al borrar usuario',
                    errors: err
                });
            }

            if (!usuarioBorrado){ 
                return res.status('400').json({
                    ok: false,
                    mensaje: 'No existe usuario con ese id',
                    errors: {messaje:'no existe un usario con ese id'}
                });
            }

            res.status('200').json({
                ok: true,
                usuario: usuarioBorrado
            });

        });

})


module.exports = app;