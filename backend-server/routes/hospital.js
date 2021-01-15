const express = require('express');

mdAuntenticacion = require('../middlewares/autenticacion');

const app = express();

const Hospital = require('../models/hospital');


// ===================================
// Obtener todos los hospitales
//====================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err)
                    return res.status('500').json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });

                Hospital.countDocuments({}, (err, conteo) => {
                    res.status('200').json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                })

            })



})

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        })
})


// ===================================
// Actualizar hospital
//====================================

app.put('/:id', mdAuntenticacion.verificaToken, (req, res) => {

    const id = req.params.id
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status('400').json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: { messaje: 'no existe un hospital con ese id' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status('400').json({
                    ok: false,
                    mensaje: 'Error al actuaizar hospital',
                    errors: err
                });
            }


            res.status('200').json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

})


// ===================================
// Insertar hospital
//====================================

app.post('/', mdAuntenticacion.verificaToken, (req, res) => {
    const body = req.body;

    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status('400').json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status('201').json({
            ok: true,
            hospital: hospitalGuardado,
        });
    })


})

// ===================================
// Eliminar hospital por el id
//====================================

app.delete('/:id', mdAuntenticacion.verificaToken, (req, res) => {

    const id = req.params.id

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status('400').json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: { messaje: 'no existe un hospital con ese id' }
            });
        }

        res.status('200').json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

})


module.exports = app;