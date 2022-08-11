import { ChangeEvent, FocusEvent } from 'react';
import { UPDATE_ON } from './types';
import useFormValue from './hooks/form-value';
import useFormConfig, { FormConfig } from './hooks/form-config';
import useFormValidator, { FormValidator } from './hooks/form-validator';
import useFormStatus from './hooks/form-status';
import { FormControl } from './core/form-control';

const useFormly = <T>(opts?: {
  validators?: FormValidator<Partial<T>>;
  formConfig?: FormConfig;
  value?: Partial<T>;
}) => {
  const controls = new Map<keyof T, FormControl<T, keyof T>>();

  const formConfig = useFormConfig(opts?.formConfig);
  const formValue = useFormValue<T>(opts?.value ?? null);
  const formStatus = useFormStatus();
  const formValidator = useFormValidator(opts?.validators);

  return {
    controlName: <P extends keyof T, E extends HTMLElement>(
      name: P,
      parser?: (v: any) => T[P]
    ) => {
      let control = controls.get(name);
      if (!control) {
        control = new FormControl<T, P>({
          controlName: name,
          value: formValue.value ? formValue.value[name] : undefined,
          disabled: formStatus.state.disabled,
          updateOn: formConfig.config.updateOn,
        });
        control.setParser(parser);
      }

      return {
        instance: control,
        handler: {
          onChange: (e: ChangeEvent<E>) => {
            control!.onChange(e, (v) => {
              if (formConfig.config.updateOn === UPDATE_ON.CHANGE) {
                formStatus.patchState({
                  dirty: true,
                });
                formValue.patchValue({
                  [name]: v,
                } as Partial<T>);
              }
            });
          },
          onFocus: (e: FocusEvent<E>) => {
            control!.onFocus(e);
            if (!formStatus.state.touched) {
              formStatus.patchState({
                touched: true,
              });
            }
          },
          onBlur: (e: FocusEvent<E>) => {
            control!.onBlur(e);
            if (formConfig.config.updateOn === UPDATE_ON.BLUR) {
              formStatus.patchState({
                dirty: true,
              });
              formValue.patchValue({
                [name]: control?.value,
              } as Partial<T>);
            }
          },
        },
      };
    },
    ...formValue,
    ...formStatus,
    ...formValidator,
  };
};

export default useFormly;
