import React, { useEffect } from 'react'
import { useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import './create.css'
const socket = io('https://server-tutifruti-online-4485aaee0663.herokuapp.com/')
//const socket = io('http://localhost:4000/')

export const CreationRoom = () => {

    const navigate = useNavigate();
    const [codigo, setCodigo] = useState('')
    const [item, setitem] = useState('')
    const [categorias, setcategotias] = useState(['Nombre', 'Apellido', 'Animal', 'Pais', 'Color', 'Fruta', 'Capital']);
    const [letras, setLetras] = useState([
        { letra: 'A', activo: true }, { letra: 'B', activo: true }, { letra: 'C', activo: true }, { letra: 'D', activo: true },
        { letra: 'E', activo: true }, { letra: 'F', activo: true }, { letra: 'G', activo: true }, { letra: 'H', activo: true },
        { letra: 'I', activo: true }, { letra: 'J', activo: true }, { letra: 'K', activo: true }, { letra: 'L', activo: true },
        { letra: 'M', activo: true }, { letra: 'N', activo: true }, { letra: 'O', activo: true }, { letra: 'P', activo: true },
        { letra: 'Q', activo: true }, { letra: 'R', activo: true }, { letra: 'S', activo: true }, { letra: 'T', activo: true },
        { letra: 'U', activo: true }, { letra: 'V', activo: true }, { letra: 'W', activo: true }, { letra: 'X', activo: true },
        { letra: 'Y', activo: true }, { letra: 'Z', activo: true },
    ])
    const generarCodigo = () => {
        let tam = 4;
        let cadena = '';
        for (let i = 0; i < tam; i++) {
            cadena += '' + (Math.floor(Math.random() * 10));
        }
        setCodigo(cadena);
    }
    useEffect(() => {
        generarCodigo();
    }, [])

    const crearSala = () => {
        socket.emit('crear-sala', { codigo, categorias });
        navigate(`/sala/${codigo}`)
    }
    const agregarCategoria = () => {
        if (item.trim().length >= 3) {
            setcategotias([...categorias, item]);
            setitem('')
        }
    }
    const eliminarCategoria = (category) => {
        if (categorias == "") {
            alert('Error');
        } else {
            let index = categorias.findIndex(x => x == category);
            const updatedCategories = [...categorias];
            updatedCategories.splice(index, 1);
            setcategotias(updatedCategories);
        }
    }
    const desactivar = (letra) => {
        const updatedLetras = letras.map((x) =>
            x.letra === letra ? { ...x, activo: !x.activo } : x
        );
        setLetras(updatedLetras);
    };
    const generarId = () => {
        let cadena = '';
        for (let i = 0; i < 10; i++) {
            cadena += (Math.floor(Math.random() * 10));
        }
        return cadena;
    }
    return (
        <div className="contenido-room">
            <div className='main'>
                <h3 className='text-center'>CREAR SALA</h3>
                <div className="confi">
                    <div className='codigos'>
                        <p className='turquesa text-center fw-bold'>Código de la sala
                        </p>
                        <div className='text-center'><input type="text" readOnly value={codigo} className='text-center' /></div>
                    </div>
                    <div className='categorias'>
                        <p className='text-center turquesa'>LISTA DE TEMAS</p>
                        <div className="p-3 items">
                            {
                                categorias.map(x => (
                                    <div key={generarId()} className='item mb-2'>
                                        <span>{x}</span>
                                        <i className="fa-sharp fa-solid fa-xmark" onClick={() => eliminarCategoria(x)}></i>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='agregar-form'>
                            <input type="text" value={item} onChange={e => setitem(e.target.value)} placeholder='Agregar tema' />
                            <button className='btn-adicionar' onClick={agregarCategoria}>Adicionar</button>
                        </div>
                    </div>
                    <div className='box-letras'>
                        <p className='text-center turquesa fw-bold mt-3'>LETRAS</p>
                        <div className='letras'>
                            {
                                letras.map(x => (<div key={generarId()} onClick={() => desactivar(x.letra)} className={x.activo ? 'activo' : 'desactivo'}><span>{x.letra}</span> </div>))
                            }
                        </div>
                    </div>
                </div>
                <br />
                <div className='d-flex justify-content-center'>
                    <button className='btn-crear' onClick={() => crearSala()}>CREAR SALA</button>
                </div>
            </div>
        </div>
    )
}
