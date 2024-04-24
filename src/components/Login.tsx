import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, CardBody, CardHeader, Input, Link, Spinner } from '@nextui-org/react'
import { useState } from 'react'
import { HeaderLogos } from './HeaderLogos'
import { Form, FormikErrors, FormikProps, withFormik } from "formik";

import { ILogin } from '../interfaces/LoginInterface'
import conn from '../api/conn'
import { encrypt } from '../helper'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { useUiStore } from '../hook/useUiStore'
// interface LoginProps {
//     onClick: (inicioSesion: string) => void;
// }

const InnerFormLogin = ( props: FormikProps<ILogin>) => {

  const {cargando} = useUiStore()

  const { touched, errors, getFieldProps, } = props;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }


  return (
    <Form>
      <Card className='bg-background md:m-10 h-[90vh]' radius='lg'> 
              <HeaderLogos/>

              <CardHeader>
                <h1 className="text-3xl font-bold col-span-3 mt-10 mx-auto">Control de Asistencia</h1>
              </CardHeader>           
              <CardBody className='px-10 md:px-20 pt-10'>
                <Input
                  { ...getFieldProps('user') }
                  labelPlacement="outside"
                  color='primary'
                  variant='bordered'
                  className='text-default-600 '
                  classNames={{
                    inputWrapper: [
                      'border-white-500',
                    ],
                    label: [
                      'text-default-600',
                      'text-md',
                    ]
                  }}
                  radius='lg'
                  size="md"
                  fullWidth
                  errorMessage={touched.user && errors.user }
                  label="Usuario"
                  placeholder="Nombre de Usuario"
                />
                <Input
                  { ...getFieldProps('password') }
                  labelPlacement="outside"
                  color='primary'
                  variant='bordered'
                  className='text-default-600 mt-10'
                  classNames={{
                    inputWrapper: [
                      'border-white-500',
                      'mt-5',
                    ],
                    label: [
                      'text-default-600',
                      'text-md',
                    ], 
                    helperWrapper: [
                      'text-default-600',
                      'text-sm',
                    ]
                  }}
                  radius='lg'
                  size="md"
                  fullWidth
                  errorMessage={touched.password && errors.password }
                  label="Password"
                  placeholder='********'
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <FontAwesomeIcon  icon={faEye} className="text-2xl text-default-600 pointer-events-none" />
                      ) : (
                        <FontAwesomeIcon icon={faEyeSlash} className="text-2xl text-default-600 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
                <Button 
                  color='primary' 
                  variant='shadow'
                  isDisabled={cargando}
                  radius='lg' 
                  className='flex mt-10 justify-center' 
                  size="md" 
                  fullWidth
                  type='submit'
                >
                  <div className="grid grid-cols-3 justify w-full">
                    <div className="col-span-1"></div>
                      Iniciar sesión
                      <div className="flex align-middle justify-end">  
                      {
                        cargando
                        ? <Spinner color='default' />
                        : <FontAwesomeIcon  icon={faChevronRight} className="text-2xl text-default-600 pointer-events-none" />
                      }
                        {/* <FontAwesomeIcon  icon={faChevronRight} className="text-2xl text-default-600 pointer-events-none" /> */}
                      </div>
                    </div>
                </Button>
                <h4 className='text-default-600 text-center mt-10'>
                  {'Copyright © '}
                  <Link isExternal href='https://sopytec.com'>
                    sopytec.cl
                  </Link>{' '}
                  {new Date().getFullYear()}
                  {'.'}
                </h4>
                
              </CardBody>
      </Card>
    </Form>
  )
}

interface MyFormProps {
  initialUser?: string
  initialDPassword?: string
}

export const Login = () => {

  const {setScreen, modCargando} = useUiStore()

  const [isOpen, setIsOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [mensaje, setMensaje] = useState('')
    
  const MyForm = withFormik<MyFormProps, ILogin>({
    // Transform outer props into form values

    mapPropsToValues: props => {
      return {
        user: props.initialUser || '',
        password: props.initialDPassword || '',
      };
    },
    
    validate: (values: ILogin) => {
      const errors: FormikErrors<ILogin> = {};
      if (!values.user) {
        errors.user = 'El Usuario es requerido';
      } 
      if (values.user.length < 5) {
        errors.user = 'El Usuario debe tener al menos 5 caracteres';
      }
      if (!values.password) {
        errors.password = 'El password es requerido';
      }
      return errors;
    },
  
    handleSubmit: async(values) => {

      const loginValues  = {
          nombreUsuario: values.user,
          pass: values.password,
      }

      try {
        modCargando(true)
        await conn.post('/MarcaUdec/ValidarCredenciales', loginValues)
        .then(response => { 
          if(response.data == 0){          
            setTitulo('Usuario No Registrado')
            setMensaje('El usuario no se encuentra registrado, por favor comuniquese con el administrador')
            setIsOpen(true)
          }else if (response.data == 1) {
            setTitulo('Usuario No Incluido en sistema de control remoto')
            setMensaje('El usuario no se encuentra incluido en el sistema de control remoto, por favor comuniquese con el administrador')
            setIsOpen(true)
          }
          else{
            setScreen('verificarCodigo')
            localStorage.setItem('token', encrypt(response.data))
            localStorage.setItem('user', encrypt(values.user))
          }
      })
      } catch (error) {
        console.log(error)
      } finally {
        modCargando(false)
      }
    },
  })(InnerFormLogin);

  return (
    <>
      <MyForm />
      <AlertDialog open={isOpen}  >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{titulo}</AlertDialogTitle>
            <AlertDialogDescription>
              {mensaje}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button color='primary' onClick={()=> setIsOpen(false)}>Cerrar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
