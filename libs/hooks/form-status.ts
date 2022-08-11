import { useState } from 'react';
export type FormStatus = {
    active: boolean;
    disabled: boolean;
    touched: boolean;
    dirty: boolean;
    submitted: boolean;
    valid: boolean;
    pending: boolean;
};

export const defaultFormStatus: FormStatus = {
    active: false,
    disabled: false,
    touched: false,
    dirty: false,
    submitted: false,
    valid: true,
    pending: false
};

const useFormStatus = (init?: Partial<FormStatus>) => {
    const defaultState = (init ? { ...defaultFormStatus, ...init } : defaultFormStatus) as FormStatus;

    // create state hooks
    const [state, setState] = useState<FormStatus>(defaultState);

    // allow to patch the state
    const patchState = (update: Partial<FormStatus>) => {
        const mergeWithCurrent = {
            ...state,
            ...update
        };
        // set the state.
        setState(mergeWithCurrent);
    }

    // allow to reset the state
    const resetState = () => setState(defaultState);

    // expose methods and the state object
    return {
        state,
        resetState,
        patchState,
        setState,
    }
}

export default useFormStatus;