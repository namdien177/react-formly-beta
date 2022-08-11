import { useState } from "react";
import { UPDATE_ON } from "./../types";

export type FormConfig = {
  updateOn: UPDATE_ON;
};

export const defaultFormConfig: FormConfig = {
  updateOn: UPDATE_ON.CHANGE,
};

/**
 * React hooks store form configuration such as
 * - updateOn: indicate when to update the value to the field. Applied
 * as global config, except if the child specify itself.
 */
const useFormConfig = (init?: Partial<FormConfig>) => {
  const defaultValue = init
    ? { ...defaultFormConfig, ...init }
    : { ...defaultFormConfig };

  // react hooks store the config.
  const [config, setConfig] = useState<FormConfig>(defaultValue);

  // allow to patch the config
  const patchConfig = (update: Partial<FormConfig>) => {
    const mergeConfig = {
      ...config,
      ...update,
    } as FormConfig;
    setConfig(mergeConfig);
  };

  // reset the config
  const resetConfig = () => setConfig(defaultValue);

  // return back the methods
  return {
    config,
    patchConfig,
    setConfig,
    resetConfig,
  };
};

export default useFormConfig;
