const { Router } = require("express");
const router = Router();
const { check } = require('express-validator')
const { validarJWT } = require('../middlewares/validar-jwt');

const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarCampos } = require("../middlewares/validar_campos");
const { isDate } = require("../helpers/isDate");

/*
    Route
    /api/events
*/

// Todas tienen que pasar por la validacion
router.use( validarJWT )

// Obtener eventos
router.get('/', getEvento )

// crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El title siempre es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento )

// Actualizar Evento
router.put('/:id', actualizarEvento )

// Borrar evento
router.delete('/:id', eliminarEvento )

module.exports = router;
