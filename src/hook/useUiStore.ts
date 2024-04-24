import { setCargando, setSelectScreen, useAppDispatch, useAppSelector } from "../store"


export const useUiStore = () => {

    const {selectScreen, cargando} = useAppSelector((state) => state.ui)
    const dispatch = useAppDispatch();

    const setScreen = (screen:string) => {
        dispatch(setSelectScreen(screen))
    }

    const modCargando = (value:boolean) => {
        dispatch(setCargando(value))
    }

  return {
    //* Propiedades
    selectScreen,
    cargando,

    //* Acciones
    setScreen,
    modCargando
  }
}
