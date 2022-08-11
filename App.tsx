import * as React from 'react';
import { z } from 'zod';

import useFormly from './libs/formly';

type sample = {
  email: string;
  displayName: string;
  password: string;
};

const schema = z.object({
  email: z.string().email(),
});

function App() {
  const { controlName, value, state, patchState, errors, validate } =
    useFormly<sample>({
      validators: {
        syncValidator: schema,
      },
    });

  return (
    <div>
      <label>Email</label>
      <br />
      <input type="text" {...controlName('email').handler} />
      <br />
      <label>Password</label>
      <br />
      <input type="password" {...controlName('password').handler} />
      <br />
      <label>Display Name</label>
      <br />
      <input type="displayName" {...controlName('displayName').handler} />
      <br />
      <hr />
      <label>Value:</label>
      <br />
      {JSON.stringify(value, null, 2)}
      <br />
      <hr />
      <label>State:</label>
      <br />
      {JSON.stringify(state, null, 2)}
      <br />
      <hr />
      {JSON.stringify(errors, null, 2)}
      <br />
      <hr />

      <button onClick={() => patchState({ dirty: false })}>Reset dirty</button>
      <br />
      <button onClick={() => validate(value)}>validate</button>
    </div>
  );
}

export default App;
