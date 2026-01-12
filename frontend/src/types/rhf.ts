// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RHFSubmitData<THandleSubmit extends (cb: (...args: any) => any, ...args: any) => any> = Parameters<
    Parameters<THandleSubmit>[0]
>[0];
