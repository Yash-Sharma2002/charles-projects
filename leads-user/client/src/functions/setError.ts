function setError(message: string, errorIn: string, hasError: boolean = true) {
  return {
    message: message,
    hasError: hasError,
    field: errorIn,
  };
}

export default setError;
