
import homeOffice from './assets/img/officelogo.png'
import relogImage from './assets/img/relojlogo.png'
import logoSopytec from './assets/img/logo blancologo.png'
import udecLogo from './assets/img/udeclogo.png'
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';
import { Login } from './components/Login'
import { CodVerificator } from './components/CodVerificator'
import { MarcarHorario } from './components/MarcarHorario'
import { useUiStore } from './hook/useUiStore'

function App() {

  const {selectScreen, setScreen} = useUiStore()

  const [anchoPagina, setAnchoPagina] = useState(document.documentElement.clientWidth);
  
    const manejarCambioDeAncho = () => {
      setAnchoPagina(document.documentElement.clientWidth);
    };

  useEffect(() => {
    // Agregar un event listener para el cambio de tamaño de la ventana
    window.addEventListener('resize', manejarCambioDeAncho);

    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', manejarCambioDeAncho);
    };
  }, []);

  useEffect(() => {
    const rut = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const cod = localStorage.getItem('cod')
    if (rut!== null && user!== null && cod!== null) {
      setScreen('marcarHorario')
    } else if (rut!== null && user!== null) {
      setScreen('verificarCodigo')
    } else {
      setScreen('inicio')
    }
  }, [])

  const showComponent = () => {

    switch (selectScreen) {
        case 'inicio':
            return <Login/>
        case 'verificarCodigo':
            return <CodVerificator/>
        case 'marcarHorario':
            return <MarcarHorario/>
        default:
            return <div>Modulo no Existe</div>
    }
}

  return (
    <>
    {
      anchoPagina < 640
      ? <div>
              {showComponent()}
        </div> 
      : <div className="relative">
      <motion.div
     initial={{ x: 0 }}
     animate={{ x: selectScreen !== 'inicio' ? "calc(98vw - 100%)" : 0 }}
      transition={{duration: 2, type: 'spring' }}
       className= 'absolute top-0 left-0 col-span-3 w-[60vw] h-screen'>
          <div className="grid grid-cols-3 bg-[length:40vw] bg-no-repeat col-span-3 bg-center h-screen p-5" style={{backgroundImage: selectScreen !== 'inicio' ? `url(${relogImage})`:`url(${homeOffice})` } }>
            <div className="bg-[length:200px] bg-no-repeat col-span-1 bg-center h-20" style={{backgroundImage: `url(${udecLogo})`} }></div>
            <div ></div>
            <div className="bg-[length:10vw] bg-no-repeat col-span-1 bg-right h-20" style={{backgroundImage: `url(${logoSopytec})`} }></div>

          </div>
      </motion.div>
      <motion.div 
      initial={{ x: "calc(100vw - 105%)" }}
      animate={{ x: selectScreen !== 'inicio' ? 0 : "calc(100vw - 110%)" }}
        
        transition={{duration: 2, type: 'spring' }}
        className='w-[35vw] h-screen'
        >
          {showComponent()}
        
      </motion.div>
    </div>
    }
      
    </>
  )
}

export default App
