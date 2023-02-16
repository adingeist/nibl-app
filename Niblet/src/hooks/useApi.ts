import {
  ApiFuncRequest as ApiFuncPayload,
  ApiFunction,
  ApiRoute,
} from '@src/types/apisauce';
import { useEffect, useReducer, useRef } from 'react';
import { AxiosRequestConfig, CancelTokenSource } from 'axios';
import {
  CancelToken,
  PROBLEM_CODE,
  ApiOkResponse,
  ApiErrorResponse,
} from 'apisauce';

type ReducerStateType = {
  error: string;
  isLoading: boolean;
  response: ApiOkResponse<unknown> | ApiErrorResponse<unknown>;
};

const initialState: ReducerStateType = {
  error: '',
  isLoading: false,
  response: {
    ok: true,
    originalError: null,
    problem: null,
    config: undefined,
    data: undefined,
    duration: undefined,
    headers: undefined,
    status: undefined,
  },
};

const reducer = (
  state: typeof initialState,
  action:
    | { type: 'AWAITING_RESPONSE' }
    | {
        type: 'SUCCESS';
        payload: { response: ApiOkResponse<unknown> };
      }
    | {
        type: 'ERROR';
        payload: { error: string; response: ApiErrorResponse<unknown> };
      },
): ReducerStateType => {
  switch (action.type) {
    case 'AWAITING_RESPONSE':
      return { ...state, isLoading: true };
    case 'SUCCESS':
      return {
        error: '',
        isLoading: false,
        response: action.payload.response,
      };
    case 'ERROR':
      return {
        isLoading: false,
        error: action.payload.error,
        response: action.payload.response,
      };

    default:
      throw new Error();
  }
};

export const useApi = <Payload extends ApiRoute, ErrorResponseData>(
  apiFunc: ApiFunction<Payload, ErrorResponseData>,
) => {
  const isMounted = useRef(true);
  const source = useRef<CancelTokenSource>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const isLoadingSync = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    source.current = CancelToken.source(); // generate a new cancel token upon mounting
    // If the component unmounted cancel any API requests
    return () => {
      source.current?.cancel();
      isMounted.current = false;
    };
  }, []);

  const request = async (
    payload: ApiFuncPayload<Payload>,
    axiosConfig?: AxiosRequestConfig,
  ) => {
    const tokenConfig = { cancelToken: source.current?.token };
    axiosConfig = { timeout: 5000, ...axiosConfig, ...tokenConfig };

    // Initialize request object
    isLoadingSync.current = true;
    dispatch({ type: 'AWAITING_RESPONSE' });

    const res = await apiFunc(payload, axiosConfig);

    if (isMounted.current && res.ok) {
      dispatch({ type: 'SUCCESS', payload: { response: res } });
      isLoadingSync.current = false;
    } else if (isMounted.current && !res.ok) {
      isLoadingSync.current = false;
      let errorMsg: string;

      const contactFailureList: PROBLEM_CODE[] = [
        'TIMEOUT_ERROR',
        'CONNECTION_ERROR',
        'NETWORK_ERROR',
        'CANCEL_ERROR',
      ];
      if (contactFailureList.includes(res.problem)) {
        errorMsg =
          'Failed to contact server. Ensure you have a strong internet connection.';
      } else {
        if (typeof res.data === 'string') {
          errorMsg = res.data;
        } else if (typeof (res.data as { error: string })?.error === 'string') {
          errorMsg = (res.data as { error: string }).error;
        } else {
          errorMsg = 'An unexpected error occurred.';
        }
      }
      // Set the request status to failed
      dispatch({
        type: 'ERROR',
        payload: { error: errorMsg, response: res },
      });
    }

    return res;
  };

  return {
    request,
    error: state.error,
    isLoading: state.isLoading,
    isLoadingSync,
    response: state.response,
  };
};
