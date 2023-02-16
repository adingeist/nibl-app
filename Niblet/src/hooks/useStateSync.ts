import { useRef, useState } from 'react';

export const useStateSync = <S>(initialState: S) => {
  const [state, setState] = useState<S>(initialState);
  const ref = useRef<S>(initialState);

  const handleSetState = (state: S) => {
    ref.current = state;
    setState(state);
  };

  return { state: state, setState: handleSetState, syncState: ref };
};
