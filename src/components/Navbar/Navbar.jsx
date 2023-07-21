import React from 'react'
import './navbar.css'
export const NavbarComponent = () => {
    return (
        <nav>
            <div className='contenido'>
                <div className="logo pt-3">
                    <h2>Tutti Frutti v3</h2>
                </div>
                <div className="enlaces">
                    <ul className='mt-3'>
                        <li>¿CÓMO FUNCIONA?</li>
                        {/* <li>APP</li>
                        <li>HISTORIA    </li>
                        <li>MAS JUEGOS</li>
                        <li>ASSETS</li> */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
