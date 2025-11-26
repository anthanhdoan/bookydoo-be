export const safe = async <T>(  promise: Promise<T>): Promise<{ result: T | undefined; error: any | undefined }> => {
  try {
    const result = await promise;
    return { result, error: undefined };
  } catch (e) {
    return { result: undefined, error: e };
  }
};
