import { useState } from 'react'

export const useForm = (callback, initialState = {}) => {
  const [values, setvalues] = useState(initialState)

  const onChange = (e) => {
    setvalues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    callback()
  }

  return {
    onChange,
    onSubmit,
    values,
  }
}
