// we can import this mock response and change it now per test
export const awsSdkGetPromiseResponse = jest
  .fn()
  .mockReturnValue(Promise.resolve({ Item: {} }));

// we can import this mock response and change it now per test
export const awsSdkPutPromiseResponse = jest.fn().mockReturnValue(
  Promise.resolve({
    ConsumedCapacity: 1,
    Attributes: {},
    ItemCollectionMetrics: {},
  })
);

const getFn = jest
  .fn()
  .mockImplementation(() => ({ promise: awsSdkGetPromiseResponse }));

const putFn = jest
  .fn()
  .mockImplementation(() => ({ promise: awsSdkPutPromiseResponse }));

class DocumentClient {
  get = getFn;
  put = putFn;
}

export const DynamoDB = {
  DocumentClient,
};
