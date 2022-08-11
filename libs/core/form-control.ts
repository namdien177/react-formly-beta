import { ChangeEvent, FocusEvent } from "react";

import { extractValueFromElement } from "../fn";
import { FormStatus } from "../hooks/form-status";
import { UPDATE_ON } from "../types";
import { defaultFormStatus } from "./../hooks/form-status";

export class FormControl<T, P extends keyof T> {
  readonly controlName: P;

  private _value: T[P] | null = null;
  private _pendingValue: T[P] | null = null;

  private _status: FormStatus = { ...defaultFormStatus };

  private _parser?: (v: any) => T[P];

  updateOn: UPDATE_ON = UPDATE_ON.CHANGE;

  constructor(opts: {
    controlName: P;
    value?: T[P];
    disabled?: boolean;
    updateOn?: UPDATE_ON;
  }) {
    this.controlName = opts.controlName;
    this._value = opts.value ?? null;
    this._status.disabled = opts.disabled || defaultFormStatus.disabled;
    this.updateOn = opts.updateOn ?? UPDATE_ON.CHANGE;
  }

  setParser(p?: (v: any) => T[P]) {
    this._parser = p;
  }

  get value() {
    return this._value;
  }

  onChange<E extends HTMLElement>(
    e: ChangeEvent<E>,
    cb?: (value: T[P] | null) => void
  ) {
    const value = extractValueFromElement<T, P, E>(e.target, this._parser);
    // update on change (default behavior)
    if (this.updateOn === UPDATE_ON.CHANGE) {
      this._value = value;
      this._pendingValue = null;
    }
    // if update on blur, we set the pending value
    // to the current change value.
    else if (this.updateOn === UPDATE_ON.BLUR) {
      this._pendingValue = value;
    }
    cb && cb(value);
  }

  onBlur<E extends HTMLElement>(
    e: FocusEvent<E>,
    cb?: (value: T[P] | null) => void
  ) {
    if (this.updateOn === UPDATE_ON.BLUR) {
      this._value = this._pendingValue;
      this._pendingValue = null;
    }
    cb && cb(this._value);
  }

  onFocus<E extends HTMLElement>(e: FocusEvent<E>) {}
}
