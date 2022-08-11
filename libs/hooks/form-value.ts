import { useState } from 'react';

const useFormValue = <T>(initialValue: Partial<T> | null = null) => {
  const setDefaultValue = (initialValue ? { ...initialValue } : null) as T;
  // create useState for storing the value with the initial value from the parameter.
  const [value, setValue] = useState<T | null>(initialValue as T);

  // create function to set value for individual field of the value;
  const patchValue = (update: Partial<T>) => {
    debugger;
    const mergeValue = { ...(value ?? {}), ...update } as T;
    setValue(mergeValue);
  };

  const resetValue = () => setValue(setDefaultValue);

  return {
    value,
    patchValue,
    setValue,
    resetValue,
  };
};

export default useFormValue;
