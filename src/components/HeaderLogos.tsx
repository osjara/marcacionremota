import { useEffect, useState } from 'react';
import logoSopytec from '../assets/img/logo blancologo.png'
import udecLogo from '../assets/img/udeclogo.png'

export const HeaderLogos = () => {

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

  return (
    <>
        {
            anchoPagina < 640
            ? <div className="flex justify-around items-center mt-4">
                    <img className="h-12" src={udecLogo} alt="" />
                    <img className="h-6" src={logoSopytec} alt="" />
                </div>
            : <div className="flex justify-around items-center mt-4"></div>
        }
    </>
  )
}
