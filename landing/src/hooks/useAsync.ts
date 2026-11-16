import { useEffect, useState } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** 마운트 시 1회 비동기 로드. 언마운트 후 setState 방지. */
export function useAsync<T>(loader: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    loader()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (alive)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          });
      });
    return () => {
      alive = false;
    };
    // loader 는 1회만 실행 (모듈 레벨 함수 사용)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
