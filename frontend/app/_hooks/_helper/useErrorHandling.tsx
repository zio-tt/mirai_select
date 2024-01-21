import { useState } from 'react';
import { Error } from '../../(routes)/(private)/helper/_types/Error';
import { set } from 'zod';

const useErrorHandling = () => {
  const [ errors, setErrors ] = useState<Error[]>([]);
  const [ isError, setIsError ] = useState(false);

  const addErrorMessages = (error: Error) => {
    const filteredErrors = errors.filter(e => e.kind !== error.kind);
    filteredErrors.push(error);
    setErrors(filteredErrors);
    setIsError(true);
  }

  const removeErrorMessages = (kind: string) => {
    const filteredErrors = errors.filter(e => e.kind !== kind);
    setErrors(filteredErrors);
    setIsError(filteredErrors.length > 0);
  }

  const resetErrorMessages = () => {
    setErrors([]);
    setIsError(false);
  }

  return {
    errors,
    isError,
    addErrorMessages,
    removeErrorMessages,
    resetErrorMessages
  }
}

export { useErrorHandling }