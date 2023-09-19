import { useState, useRef } from "react";

const useProxyState = <T extends object>(initialState: T) => {
  const [, setDummy] = useState(0);
  const proxyRef = useRef(
    new Proxy(initialState, {
      get() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line prefer-rest-params
        return Reflect.get(...arguments);
      },
      set() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line prefer-rest-params
        Reflect.set(...arguments);
        setDummy((v) => v + 1);
        return true;
      },
    })
  );
  return proxyRef.current;
};

export default useProxyState;
