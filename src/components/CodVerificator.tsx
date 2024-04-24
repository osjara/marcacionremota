import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faReply } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Card, CardBody, CardFooter, CardHeader, Link } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { HeaderLogos } from "./HeaderLogos";
import { useUiStore } from "../hook/useUiStore";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "./ui/input-otp";
import conn from "../api/conn";
import { decrypt, encrypt } from "../helper";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "./ui/alert-dialog"


export const CodVerificator = () => {

    const [timeOver, setTimeOver] = useState(false)
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [otp, setOtp] = useState('')
    const [alertError, setAlertError] = useState(false)


    const {setScreen} = useUiStore()

    const handleInicioSesion = () => {
        const rut = localStorage.getItem('token')
        
        if (rut !== null) {
            conn.get(`/MarcaUdec/ValidarCodigoMarcacion/${decrypt(rut)}/${otp}`)
            .then(res => {
                if (res.data ) {
                    localStorage.setItem('cod', encrypt(otp))
                    setScreen('marcarHorario')
                } else {
                    setAlertError(true)
                    setOtp('')
                    const input = document.querySelector(
                        'input[name="cod-1"]'
                      ) as HTMLInputElement;
                      input?.focus();
                }
             })
             .catch(err => {
                console.log(err)
             })

            
        }
    }

    const handleCerrarSesion = () => {
        setScreen('inicio')
        localStorage.clear()
    }

    const handleReenviarCodigo = () => {
        const rut = decrypt(localStorage.getItem('token') || '')
        const user = decrypt(localStorage.getItem('user') || '')

        conn.get(`/MarcaUdec/ReEnviarCodigoValidacion/${rut}/${user}`)
        .then(res => {
            if (res.data ) {
                setMinutes(5)
                setSeconds(0)
                setTimeOver(false)
            }
         })
    }

    

    useEffect(() => {
        const interval = setInterval(() => {
        if (seconds > 0) {
            setSeconds(seconds - 1);
        }
        if (seconds === 0) {
            if (minutes === 0) {
            clearInterval(interval);
            } else {
            setMinutes(minutes - 1);
            setSeconds(59);
            }
        }
        if (minutes  === 0 && seconds === 0) {
            setTimeOver(true)
        }
        }, 1000);
        return () => clearInterval(interval);
    });

  useEffect(() => {
    const input = document.querySelector(
      'input[name="cod-1"]'
    ) as HTMLInputElement;
    input?.focus();
  }, []);


  return (
        <Card className='bg-background md:m-10 h-[90vh]' radius='lg'> 
            <HeaderLogos/>
                <CardHeader className=' flex-col p-12'>
                    
                    <h1 className="text-3xl text-pretty text-center font-bold col-span-3 ">Hemos enviado un Codigo a tu correo </h1>
                    <div className="flex items-end">
                        <h4 className="text-xl mt-2 mr-2">Codigo valido por: </h4>
                        <FontAwesomeIcon  icon={faClock} className="text-2xl text-default-600 pointer-events-none" />
                        <h4 className="text-xl text-[#e87726] ml-2">0{minutes}:{seconds < 10 ? `0${seconds}` : seconds} min</h4>
                    </div>
                </CardHeader>           
                <CardBody className='px-10 md:px-20'>

                    <div className="flex flex-col items-center">

                        <InputOTP maxLength={5} value={otp} onChange={setOtp} name="cod-1">
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                        </InputOTPGroup>
                        </InputOTP>
                    </div>
                <Button
                    isDisabled={timeOver || otp.length < 5}
                    color='primary' 
                    variant='shadow'
                    radius='lg' 
                    className='flex mt-10 justify-center' 
                    size="md" 
                    fullWidth
                    onClick={handleInicioSesion}
                >
                    <div className="grid grid-cols-3 justify w-full">
                    <div className="col-span-1"></div>
                        Verificar Codigo
                        <div className="flex justify-end">  
                            <FontAwesomeIcon  icon={faChevronRight} className="text-2xl text-default-600 pointer-events-none" />
                        </div>
                    </div>
                </Button>
                <Button
                    color='secondary' 
                    variant='shadow'
                    radius='lg' 
                    className= 'flex mt-10 justify-center'
                    size="md" 
                    fullWidth
                    onClick={handleReenviarCodigo}
                >
                    <div className="grid grid-cols-3 justify w-full">
                    <div className="col-span-1"></div>
                        Reenviar Codigo
                        <div className="flex justify-end">  
                            <FontAwesomeIcon  icon={faReply} className="text-2xl text-default-600 pointer-events-none" />
                        </div>
                    </div>
                </Button>
                
                </CardBody>
                <CardFooter className="flex justify-start">
                    <Link onClick={handleCerrarSesion}>
                        <FontAwesomeIcon icon={faChevronLeft} className="text-2xl ml-3 text-default-600 pointer-events-none" />
                        <h4 className="ml-2 text-default-600">Volver a Inicio de sesión</h4>
                    </Link>
                </CardFooter>
                <AlertDialog open={alertError}  >
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>El Codigo no es valido</AlertDialogTitle>
                        <AlertDialogDescription>
                        vuelva a solicitar el codigo, si el error persiste comuniquese con el administrador
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button color='primary' onClick={()=> setAlertError(false)}>Cerrar</Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </Card>
  )
}