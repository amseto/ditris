import {useState} from 'react'

const useInput = (validateFunction,defaultValue) =>{
  const [value, setValue] = useState(defaultValue);
  const [isTouched,setIsTouched] = useState(false)

  const isValueValid = validateFunction(value)
  const hasError = isTouched&& !isValueValid

  const valueChangeHandler = (event) =>{
    setValue(event.target.value)
  }

  const blurHandler = (event) =>{
    setIsTouched(true)
  }

  const reset = () =>{
    setIsTouched(false)
    setValue("")
  }

  return {
    value,
    isTouched,
    hasError,
    isValueValid,
    valueChangeHandler,
    blurHandler,
    reset,
    setValue
    
  }


}

export default useInput