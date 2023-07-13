
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'
import { NavbarComponent } from '../Navbar/Navbar'
export const Home = () => {
    const [codigo, setCodigo] = useState('')
    const navigate = useNavigate();
    const unirmeSala = () => {
        if (codigo.trim() != "") {
            navigate('/sala/' + codigo);
        } else alert('Ingresa el codigo de la sala');
    }
    const crearSala = () => {
        navigate('/creation-room');
    }
    return (
        < >
            <div className='bg-header'>
                <NavbarComponent/>
                <div className="header-2">

                    <div className='main-2'>
                        <h1>
                            Tutifruti Challenge: ¡Demuestra tu ingenio y rapidez mental!
                        </h1>
                        <br />
                        <p>Sumérgete en la emocionante competencia de Tutifruti Challenge, el juego de palabras y categorías donde tu ingenio y rapidez mental serán puestos a prueba. ¡Desafía a tus amigos o juega solo mientras intentas encontrar palabras únicas que comiencen con la misma letra en distintas categorías! Con un límite de tiempo emocionante y categorías desafiantes, el Tutifruti Challenge te mantendrá entretenido y desafiado en cada ronda. ¿Tienes lo necesario para ser el campeón de Tutifruti? ¡Descúbrelo ahora!</p>
                    </div>
                    <div className='botones'>
                        <div className='box-crear' onClick={() => crearSala()}>
                            <span>CREAR SALA</span>
                        </div>
                        <div className='box-unirme-2'>
                            <div>
                                <input type="text" onChange={(e) => setCodigo(e.target.value)} placeholder='PIN de juego' />
                                <button onClick={() => unirmeSala()}>UNIRSE A LA SALA </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
