import { EffectCallback, useEffect } from 'react';

export const useOnMount = (cb: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(cb, []);
};
