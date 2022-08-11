import { useState } from 'react';
import { z } from 'zod';

export type FormValidator<T> = {
  syncValidator?: z.ZodType<T>;
  asyncValidator?: z.ZodType<T>;
};

export type FormValidatorError<T> = {
  [controlName in keyof T]?: z.ZodIssue[];
};

// react hooks provides validation methods and returns errors

const useFormValidator = <T>(init?: Partial<FormValidator<T>>) => {
  const defaultSyncValidator = init?.syncValidator ?? null;
  // syncValidator state
  const [syncValidator, setSyncValidator] = useState<z.ZodType<T> | null>(
    defaultSyncValidator
  );

  const defaultAsyncValidator = init?.asyncValidator ?? null;
  // asyncValidator state
  const [asyncValidator, setAsyncValidator] = useState<z.ZodType<T> | null>(
    defaultAsyncValidator
  );

  // error state
  const [errors, setErrors] = useState<FormValidatorError<T> | null>(null);

  // async task id - to stop overriding the current run async validation.
  let taskId: string | null = null;

  // function to validate and return errors
  function validate(value: T | null) {
    // if no validator is set, return empty array;
    if (!syncValidator && !asyncValidator) {
      setErrors(null);
      return null;
    }

    let errors: FormValidatorError<T> = {};
    // perform syncValidator
    if (syncValidator) {
      const issues = syncValidator.safeParse(value) as z.SafeParseError<T>;
      if (!issues.success) {
        errors = reduceErrorToField<T>(issues.error.issues, errors);
        setErrors(errors);
      }
    }
    // perform asyncValidator
    if (asyncValidator) {
      const runningTask = createTaskId();
      taskId = runningTask;
      asyncValidator
        .safeParseAsync(value)
        .then((result: z.SafeParseError<T>) => {
          if (!result.success && taskId === runningTask) {
            errors = reduceErrorToField<T>(result.error.issues, errors);
            setErrors(errors);
            taskId = null;
          }
        });
    }
  }

  function createTaskId(length = 4) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function reduceErrorToField<T>(
    issues: z.ZodIssue[],
    initField: FormValidatorError<T> = {}
  ) {
    const errorPerField = issues.reduce((acc, error) => {
      const controlName = error.path[0] as keyof T;
      acc[controlName] = [...(acc[controlName] ?? []), error];
      return acc;
    }, initField);
    return errorPerField;
  }

  return {
    errors,
    setSyncValidator,
    setAsyncValidator,
    validate,
  };
};

export default useFormValidator;
