
/*
    Rutas de usuarios / auth host + /api/auth
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator')

const { validarJWT } = require('../middlewares/validar-jwt');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');

router.post(
    '/new', 
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El nombre es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/', 
    [ 
        check('email', 'El nombre es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;
