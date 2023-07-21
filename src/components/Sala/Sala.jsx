import React, { useEffect, useRef, useState } from 'react'
import linkImage from '../../assets/link.png'
import imgEsperando from '../../assets/esperando_jogadores.png'
import avatar from '../../assets/1.svg'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import './sala.css'
export const Sala = () => {

  let { codigo } = useParams();
  const [socket, setSocket] = useState(null);
  const [ventaNombre, setVentaNombre] = useState('flex')
  const [categorias, setCategorias] = useState(['Nombre', 'Apellido', 'Pais', 'Fruta', 'Animal', 'Objeto'])
  const [pantallas, setPantallas] = useState([true, false, false])
  const [mensajes, setmensajes] = useState([])
  const [textMessage, setTextMessage] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [letra, setLetra] = useState('?');
  const [esAdmin, setEsAdmin] = useState(false);
  const boxMensajes = useRef(null);
  const [entradas, setEntradas] = useState({})
  const [click, setClick] = useState(false);
  const [clickCorregir, setclickCorregir] = useState(false);
  const [data, setdata] = useState(null);
  const [clickDetener, setClickDetener] = useState(false);
  const generarId = () => {
    let cadena = '';
    for (let i = 0; i < 10; i++) {
      cadena += (Math.floor(Math.random() * 10));
    }
    return cadena;
  }
  const [respuestas, setRespuestas] = useState([])
  const [letras, setletras] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'X', 'Y', 'Z']);
  useEffect(() => {
    //const newSocket = io('https://server-tutifruti.vercel.app/' + codigo);
    const newSocket = io('http://localhost:4000/' + codigo);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    }
  }, [codigo]);


  const enviarMensaje = () => {
    if (textMessage.trim().length >= 1) {
      socket.emit('chat-message', {
        user: nombre,
        mensaje: textMessage
      });
      setTextMessage('')
    }
  }
  const elegirLetra = (num) => {
    let i = 0;
    let _time = setInterval(() => {
      setLetra(letras[i])
      i++;
      if (i >= num) clearInterval(_time);
    }, 100);
  }

  const activarCorreccion = (id, tema) => {
    socket.emit('correccion', { id, tema })
  }

  const iniciarJuego = () => {
    if (esAdmin) {
      if (letra == '?') {
        alert('Debes seleccionar una letra');
      } else {
        socket.emit('empezar-juego', 'empezar');
      }
    } else {
      alert('Usted no tiene permiso para iniciar el juego');
    }
  }
  const enviarNombre = () => {
    if (nombre.trim().length >= 3) {
      entradas['usuario'] = nombre;
      socket.emit('enviar-nombre', nombre);
      setVentaNombre('none')
    }
  }
  const girarLetra = () => {
    socket.emit('girar-letra', Math.floor(Math.random() * letras.length));
  }


  useEffect(() => {

    if (socket) {
      socket.on('chat-message', (data) => {
        setmensajes((mensajes) => [...mensajes, data]);
        boxMensajes.current.scrollTop = boxMensajes.current.scrollHeight + 10;

      });
      socket.on('enviar-usuarios', data => {
        setUsuarios(data.usuarios);
        setCategorias(data.categorias);
        for (let i = 0; i < data.categorias.length; i++) {
          setEntradas(prevEntradas => ({
            ...prevEntradas,
            [data.categorias[i]]: { id: generarId(), respuesta: '', correcto: null }
          }));
        }


      });
      socket.on('detener-juego', data => {
        setClickDetener(true);
        detenerJuego();
      });
      socket.on('start', data => {
        empezarJugar();
      })
      socket.on('actualizar-usuarios', (data) => {
        setUsuarios(data);
      })

      socket.on('enviar-respuestas', data => {
        setRespuestas(data);
      })
      socket.on('escoger-letra', data => {
        elegirLetra(data);
      })
      socket.on('reiniciar-juego', data => {
        setLetra('?');
        setUsuarios(data);
        iniciarNuevamente();
      })
      socket.on('corregir-respuesta', data => {
        setclickCorregir(true);
        setdata(data);
      })
    }
    return () => {
      if (socket) {
        socket.off('chat-message');
        socket.off('enviar-usuarios');
        socket.off('actualizar-usuarios');
        socket.off('start');
        socket.off('detener-juego');
        socket.off('enviar-respuestas');
        socket.off('escoger-letra');
        socket.off('reiniciar-juego');
        socket.off('corregir-respuesta');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (usuarios.length >= 1) {
      if (usuarios[0].id == socket.id) setEsAdmin(true);
    }
  }, [usuarios]);
  useEffect(() => {

    if (clickDetener) {
      for (let cate of categorias) {
        setEntradas(prev => ({ ...prev, [cate]: { ...prev[cate], respuesta: '', correcto: null } }))
      }
      setClickDetener(false);
    }
  }, [clickDetener, entradas]);

  const corregirRespuesta = () => {
    const update = respuestas.map(x =>
      x[data.tema].id == data.id ? { ...x, [data.tema]: { ...x[data.tema], correcto: !x[data.tema].correcto } } : x);
    setRespuestas(update);
  }

  useEffect(() => {
    if (clickCorregir) {
      corregirRespuesta();
      setclickCorregir(false);
    }
  }, [respuestas, clickCorregir, data])

  const detener = () => {
    socket.emit('detener', 'data');
  }
  const detenerJuego = () => {

    setClick(!click);
  };
  useEffect(() => {
    if (Object.keys(entradas).length != 0 && click) {
      socket.emit('enviar-resultados', entradas);
      setPantallas([false, false, true])
      setClick(false);
    }
  }, [click, entradas])


  const empezarJugar = () => {
    setPantallas([false, true, false])
  }
  const findByUser = (user) => {
    let _aux = usuarios.find(x => x.nombre == user);
    return { id: _aux.id, puntaje: _aux.puntaje };
  }
  const activarReiniciar = () => {

    if (esAdmin) {
      const update = respuestas.map(x => ({ id: findByUser(x['usuario']).id, nombre: x['usuario'], puntaje: obtenerPuntaje(x) + findByUser(x['usuario']).puntaje }))
      socket.emit('reiniciar', update);
    } else {
      alert('Solo el admin puede iniciar el juego');
    }
  }
  const obtenerPuntaje = (rpta) => {
    let cont = 0;
    for (let tema in rpta) {
      if (tema !== 'usuario' && rpta[tema].correcto) {
        cont++;
      }
    }
    return cont;
  }
  const iniciarNuevamente = () => {
    setPantallas([true, false, false])
  }
  return (
    <>
      <div className="box-toggle" style={{ display: ventaNombre }}>
        <div className="toggle" >
          <h4 >SALA {codigo}</h4>
          <div className='text-center mt-3'>
            <img src={linkImage} alt="" className='img-fluid' />
          </div>
          <br />
          <p>Escribe tu nombre</p>
          <div className='text-center'>
            <input type="text" placeholder='tu nombre..' onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className='text-center'>
            <button onClick={() => enviarNombre()}>ACEPTAR</button>
          </div>
        </div>
      </div>
      <div className="sala-container">
        <div className="sala-contenido">
          <div className="sala-encabezado">
            <div className='logo'>
              <br />
              <h3 className='mt-3 ms-2'>Tutti Frutti</h3>
            </div>
            <div className='letra'>
              <div>
                <div className="box-letra" onClick={() => girarLetra()}>
                  <span>{letra}</span>
                </div>
              </div>
            </div>
            <div className='salir'></div>
          </div>
          <div className="sala-box">
            <div className='sala-participantes'>
              {
                usuarios.map(x => (
                  <div className="nombre-usuario" key={x.id}>
                    <div className='p-2'>
                      <img src={avatar} alt="" />
                    </div>
                    <div className='ps-2 pt-1'>
                      <span className='nombre'>{x.nombre}</span><br />
                      <span className='puntos'>{x.puntaje} ptos</span>
                    </div>
                  </div>))
              }
            </div>
            <div className='sala-mesa'>
              {pantallas[0] ? (<div className='box text-center'>
                <h4>ESPERANDO</h4>
                <img src={imgEsperando} alt="img" className='img-fluid' />
                {
                  esAdmin ? (<p>USTED ES EL ADMINISTRADOR DE LA SALA. INICIE EL JUEGO CUENDO ESTE LISTO</p>) : (<p>DEBE ESPERAR A QUE EL ADMINISTRADOR INICIE EL JUEGO</p>)
                }
              </div>) : ''}
              {pantallas[1] ? (<div>
                <div className="box-entrada mx-3">
                  {
                    categorias.map(x => (
                      <div key={x}>
                        <h6 className='text-center entrada'>{x}</h6>
                        <input type="text" value={entradas[x].respuesta} onChange={e => setEntradas(prevEntradas => ({
                          ...prevEntradas,
                          [x]: { ...prevEntradas[x], ['respuesta']: e.target.value }
                        }))} />
                      </div>
                    ))
                  }
                </div>
              </div>) : ''}
              {pantallas[2] ? (<div className='box-resultados'>
                <h4 className='text-light'>Resultados</h4>
                <table className='tabla-resultado'>
                  <thead>
                    <tr>
                      <td ><span className='importante'>USUARIO</span></td>
                      {
                        categorias.map(x => (<td key={generarId()}><span className='importante'>{x}</span></td>))
                      }
                      <td ><span className='importante'>PUNTAJE</span></td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      respuestas.map((respuesta, index) => (
                        <tr key={generarId()}>
                          {
                            Object.keys(respuesta).map((x) => (
                              <td key={generarId()}>
                                {
                                  x == 'usuario' ? (<span className='importante'> {respuesta[x]}</span>) :
                                    (<span onClick={() => activarCorreccion(respuesta[x].id, x)} className={respuesta[x].correcto == null ? 'por-corregir resto' : (respuesta[x].correcto ? 'correcto resto' : 'incorrecto resto')}>{respuesta[x].respuesta}</span>)
                                }
                              </td>
                            ))

                          }
                          <td><span className='importante'>{obtenerPuntaje(respuesta)}</span></td>
                        </tr>
                      ))

                    }
                  </tbody>
                </table>
              </div>) : ''}
              <div className='text-center mt-2'>
                {pantallas[0] ? (<button className='sala-btn' onClick={() => iniciarJuego()}>INICIAR</button>) : ''}
                {pantallas[1] ? (<button className='sala-btn' onClick={() => detener()}>DETENER</button>) : ''}
                {pantallas[2] ? (<button className='sala-btn' onClick={() => activarReiniciar()}>NUEVO JUEGO</button>) : ''}
              </div>
            </div>
            <div className='sala-chat'>
              <div className='box-mensajes' ref={boxMensajes} >
                {
                  mensajes.map(x => (
                    <div className='mensaje mt-2' key={Math.random() * 100}>
                      <span className='nombre-usuario'><strong>{x.nombre}</strong></span><br />
                      <span className='descripcion'>{x.mensaje}</span>
                    </div>
                  ))

                }

              </div>
              <div className="sala-form-chat">
                <input type="text" value={textMessage} onChange={(e) => setTextMessage(e.target.value)} placeholder='Escribe aqui..' />
                <button onClick={() => enviarMensaje()}>    </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  )
}
