
const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req , res = response ) => {
    
    const { email, password } = req.body;
    
    try {
        
        let usuario = await Usuario.findOne({ email })

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario existe con ese correo'
            })
        }
        
        usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync( password, salt )

        await usuario.save();

        // Gerenerar JWT
        const token = await generarJWT( usuario.id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor coso'
        })
    }
    
}

const loginUsuario = async(req, res = response ) => {
    
    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email })

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo'
            })
        }

        // Confirmar contraseña

        const validPassword = bcrypt.compareSync( password, usuario.password )

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto'
            })
        }

        // Gerenerar JWT
        const token = await generarJWT( usuario.id, usuario.name )

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor coso'
        })
    }
    
}

const revalidarToken = async(req, res = response ) => {

    const { uid, name } = req

    // Generar un nuevo token

    const token = await generarJWT( uid, name )

    res.json({
        ok: true,
        msg: 'renew',
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}
