import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Card, CardBody, CardFooter, CardHeader, Link, Spinner, Textarea } from "@nextui-org/react"
import { useEffect, useState } from "react";
import { HeaderLogos } from "./HeaderLogos";
import { useUiStore } from "../hook/useUiStore";
import { decrypt } from "../helper";
import conn from "../api/conn";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "./ui/alert-dialog"

export const MarcarHorario = () => {

    const [valueMarca, setValueMarca] = useState('')
    const [estado, setEstado] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [alertMarca, setAlertMarca] = useState(false)
    const {setScreen} = useUiStore()

    const handleCerrarSesion = () => {
        setScreen('inicio')
        localStorage.clear()
    }

    const [fecha, setFecha] = useState(new Date());

    const handleMarcar = (evento: string) => {
        
        setEstado(true)
        const marcaje ={
            rut: decrypt(localStorage.getItem('token') || ''),
            evento: evento,
            fechaYHora: new Date(fecha.setHours(fecha.getHours() - 4)).toJSON(),
            codigo: decrypt(localStorage.getItem("cod") || ""),
        }
        conn.post('/MarcaUdec/InsertarMarcaje', marcaje)
        .then(res => {
            if (res.data ) {
                switch (evento) {
                    case 'E':
                        setValueMarca(
                            `Registro de Ingreso Exitoso \nHora de registro: ${new Date().toLocaleTimeString()}`
                            )
                            setAlertMarca(true)
                        break;
                    case 'S':
                        setValueMarca(
                            `Registro de Salida Exitoso \nHora de registro: ${new Date().toLocaleTimeString()}`
                            )
                            setAlertMarca(true)
                        break
                    default:
                        break;
                }
            } else {
                setAlertError(true)
            }
         })
         .catch(err => {
            setAlertError(true)
            console.log(err)
         })
         .finally(() => {
            setEstado(false)
         })
    }

    const handleCerrarMarca = () => {
        setAlertMarca(false)
        localStorage.clear()
        setScreen('inicio')
        
    }


  useEffect(() => {
    const intervalo = setInterval(() => {
      setFecha(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  return (
    <Card className='bg-background md:m-10 h-[90vh]' radius='lg'> 
            <HeaderLogos/>
                <CardHeader className=' flex-col p-10'>
                <h1 className="text-3xl text-pretty text-center font-bold col-span-3 ">Registra Tu Inicio o Termino de Jornada </h1>
                <div className="flex items-center mt-4">
                    <FontAwesomeIcon  icon={faClock} className="text-2xl text-default-600 pointer-events-none" />
                    <h4 className="text-2xl  ml-2">{fecha.toLocaleTimeString()}</h4>
                </div>
                </CardHeader>           
                <CardBody className='px-10 md:px-20'>
                <Button
                    name="verificarCodigo"
                    color='success' 
                    variant='shadow'
                    radius='lg' 
                    className='flex mt-0 justify-center h-[10vh]'  
                    size="md" 
                    fullWidth
                    onClick={() => {
                        handleMarcar('E')
                    }}
                >
                    <div className="grid grid-cols-3 justify w-full">
                    <div className="col-span-1"></div>
                        Marcar Entrada
                        <div className="flex justify-end">  
                            <FontAwesomeIcon  icon={faChevronRight} className="text-2xl text-default-600 pointer-events-none" />
                        </div>
                    </div>
                </Button>
                <Button
                    name="verificarCodigo"
                    color='danger' 
                    variant='shadow'
                    radius='lg' 
                    className= 'flex mt-5 justify-center h-[10vh]'
                    size="lg" 
                    fullWidth
                    onClick={() => {
                        handleMarcar('S')
                    }}
                >
                    <div className="grid grid-cols-3 justify w-full">
                        <div className="flex justify-start">  
                            <FontAwesomeIcon  icon={faChevronLeft} className="text-2xl text-default-600 pointer-events-none" />
                        </div>
                        Marcar Salida
                        <div className="col-span-1"></div>
                    </div>
                </Button>
                <div className="mt-5 flex items-center justify-center">
                    { estado
                        ? <Spinner color="default" size="lg" label="Cargando..."/>
                        :<Textarea
                            isReadOnly
                            variant="bordered"
                            radius="lg"
                            className={valueMarca.length > 0? 'flex items-center' : 'hidden'}
                            classNames={{
                                inputWrapper: [
                                    'border-white-500',
                                    'radius-xl',
                                ],
                                input: [
                                    'text-default-600',
                                    'text-xl',
                                    'text-center',
                                ]
                                }}
                            labelPlacement="outside"
                            placeholder=""
                            fullWidth
                            value={valueMarca}
                        />
                    }
                </div>
                </CardBody>
                <CardFooter className="flex justify-start">
                    <Link onClick={handleCerrarSesion} color="foreground">
                        <FontAwesomeIcon icon={faChevronLeft} className="text-2xl ml-3 text-default-600 pointer-events-none" />
                        <h4 className="ml-2 text-default-600">Volver a Inicio de sesión</h4>
                    </Link>
                </CardFooter>
                <AlertDialog open={alertError}  >
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>No Fue Posible Registrar Marca</AlertDialogTitle>
                        <AlertDialogDescription>
                        Vuelva a intentarlo, si el problema persiste comuniquese con el administrador.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button color='primary' onClick={()=> setAlertError(false)}>Cerrar</Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={alertMarca}  >
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Marca Existosa</AlertDialogTitle>
                        <AlertDialogDescription>
                        {valueMarca}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button color='primary' onClick={()=> handleCerrarMarca()}>Cerrar sesion</Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </Card>
  )
}


