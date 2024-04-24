import { createSlice } from '@reduxjs/toolkit'

export interface UiState{
    selectScreen: string
    cargando: boolean
}

const initialState: UiState ={
  selectScreen: 'inicio',
  cargando: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    
    setSelectScreen: ( state, {payload} ) => {
      state.selectScreen = payload;
    },
    setCargando: ( state, {payload} ) => {
      state.cargando = payload;
    }
  }
});

export const {  
          setSelectScreen, 
          setCargando
                  } = uiSlice.actions