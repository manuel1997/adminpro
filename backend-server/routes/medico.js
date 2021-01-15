const express = require('express');

mdAuntenticacion = require('../middlewares/autenticacion');

const app = express();

const Medico = require('../models/medico');


// ===================================
// Obtener todos los medicos
//====================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err)
                    return res.status('500').json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });

                    Medico.countDocuments({},(err,conteo)=>{
                        res.status('200').json({
                            ok: true,
                            medicos: medicos,
                            total:conteo
                        });
                    })

            })



})

// ===================================
// Obtener medico
//====================================

app.get('/:id',(req,res) => {

    const id = req.params.id

    Medico.findById(id)
        .populate('usuario','nombre email img')
        .populate('hospital','nombre email img')
        .exec((err,medico) => {

            if (err){ 
                return res.status('500').json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if(!medico){
                return res.status('400').json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: {messaje:'no existe un medico con ese id'}
                });
            }

            res.status('200').json({
                ok: true,
                medico:medico
            });

        })

})


// ===================================
// Actualizar medico
//====================================

app.put('/:id',  mdAuntenticacion.verificaToken, (req, res) => {

    const id = req.params.id
    const body = req.body;

    Medico.findById(id, (err, medico) => {
        
            if (err){ 
                return res.status('500').json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if(!medico){
                return res.status('400').json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: {messaje:'no existe un medico con ese id'}
                });
            }

            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save( (err, medicoGuardado) => {

                if(err){
                return res.status('400').json({
                    ok: false,
                    mensaje: 'Error al actuaizar medico',
                    errors: err
                });
            }

                res.status('200').json({
                    ok: true,
                    usuario:medicoGuardado
                });

            });
        
    });     
  
})


// ===================================
// Insertar medico
//====================================

app.post('/', mdAuntenticacion.verificaToken, (req, res) => {
    const body = req.body;

    const medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( (err, medicoGuardado) => {

        if (err){ 
            return res.status('400').json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status('201').json({
            ok: true,
            medico: medicoGuardado,
        });
    })

  
})

// ===================================
// Eliminar medico por el id
//====================================

app.delete('/:id',  mdAuntenticacion.verificaToken, (req,res) =>{

    const id = req.params.id

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

            if (err){ 
                return res.status('500').json({
                    ok: false,
                    mensaje: 'Error al borrar medico',
                    errors: err
                });
            }

            if (!medicoBorrado){ 
                return res.status('400').json({
                    ok: false,
                    mensaje: 'No existe medico con ese id',
                    errors: {messaje:'no existe un medico con ese id'}
                });
            }

            res.status('200').json({
                ok: true,
                medico: medicoBorrado
            });

        });

})


module.exports = app;