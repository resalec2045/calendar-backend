const { response } = require('express')
const Evento = require("../models/Evento");

const getEvento = async( req , res = response ) => {

    try {

        const eventos = await Evento.find().populate('user', 'name');

        res.status(201).json({
            ok: true,
            eventos
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal'
        })
    }

}


const crearEvento = async( req , res = response ) => {

    const evento = new Evento( req.body )

    try {

        evento.user = req.uid;

        const eventoGuardado = await evento.save()

        res.status(201).json({
            ok: true,
            evento: eventoGuardado 
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal'
        })
    }

}

const actualizarEvento = async( req , res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Zorra inmunda, no puede editar este mensaje'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } )
 
        res.status(201).json({
            ok: true,
            eventoActualizado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal'
        })
    }

}

const eliminarEvento = async( req , res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'Zorra inmunda, no puede eliminar este mensaje'
            })
        }

        const eventoEliminado = await Evento.findByIdAndDelete( eventoId, { new: true } )
 
        res.status(201).json({
            ok: true,
            eventoEliminado
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal'
        })
    }

}

module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
