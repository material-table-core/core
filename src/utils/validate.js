function validateInput(columnDef, data) {
  if (columnDef.validate) {
    const validateResponse = columnDef.validate(data);
    switch (typeof validateResponse) {
      case 'object':
        return { ...validateResponse };
      case 'boolean':
        return { isValid: validateResponse, helperText: '' };
      case 'string':
        return { isValid: false, helperText: validateResponse };
      default:
        return { isValid: true, helperText: '' };
    }
  }
  return { isValid: true, helperText: '' };
}

export { validateInput };
