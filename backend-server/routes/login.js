const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEDD;

const app = express();

const Usuario = require('../models/usuario');

//Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(CLIENT_ID);

const mdAutenticacion = require('../middlewares/autenticacion')

// =====================================
// Autenticacion de google
// =====================================

app.get('/renuevatoken', mdAutenticacion.verificaToken, (req,res) => {

    const token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }) //4 horas

    res.status('200').json({
        ok: true,
        usuario: req.usuario,
        token: token,
    });

})

// =====================================
// Autenticacion de google
// =====================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }
}

app.post('/google', async (req, res) => {

    let token = req.body.token;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status('403').json({
                ok: false,
                mensaje: 'Token no valido',
            });
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status('400').json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticacion normal',
                });
            } else {


                const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

                res.status('200').json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu:obtenerMenu(usuarioDB.role)
                });
            }
        }else{
            // El usuario no existe, hay que crearlo 
            const usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err,usuarioDB) => {
                
                const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

                res.status('200').json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                    menu:obtenerMenu(usuarioDB.role)
                });

            })

        }


    })

   /*  return res.status('200').json({
        ok: true,
        mensaje: 'OK!!!',
        googleUser: googleUser
    }); */

})


// =====================================
// Autenticacion normal
// =====================================

app.post('/', (req, res) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status('500').json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status('400').json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status('400').json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        usuarioDB.password = ':)';
        const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

        res.status('200').json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
            menu:obtenerMenu(usuarioDB.role)
        });
    })



});


function obtenerMenu(Role){

    let menu = [
        {
          titulo:'Principal',
          icono:'mdi mdi-gauge',
          submenu:[
            {titulo:'Dashboard', url:'/dashboard'},
            {titulo:'progressBar', url:'/progress'},
            {titulo:'Graficas', url:'/graficas1'},
            {titulo:'Promesas', url:'/promesas'},
            {titulo:'Rxjs', url:'/rxjs'}
            
          ]
        },
        {
          titulo:'Mantenimientos',
          icono:'mdi mdi-folder-lock-open',
          submenu:[
            //{titulo:'Usuarios', url:'/usuarios'},
            {titulo:'Medicos', url:'/medicos'},
            {titulo:'Hospitales', url:'/hospitales'},
          ]
        }
      ];

      if(Role === 'ADMIN_ROLE'){
       menu[1].submenu.unshift({titulo:'Usuarios', url:'/usuarios'});
      }

      return menu

}


module.exports = app;