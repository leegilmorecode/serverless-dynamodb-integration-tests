import { createOrder, getOrder } from "../orders.db.service";

import { awsSdkGetPromiseResponse } from "../../__mocks__/aws-sdk";

describe("orders.db.service", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2022, 1, 28));
  });

  beforeEach(() => {
    awsSdkGetPromiseResponse.mockReset(); // reset the mock between tests
  });

  describe("getOrder", () => {
    describe("on error", () => {
      it("should throw an error if no item is found in the db", () => {
        // arrange
        const orderId = "111";

        awsSdkGetPromiseResponse.mockResolvedValueOnce({ Item: undefined });

        // act & assert
        return expect(getOrder(orderId)).rejects.toThrowError(
          "order 111 not found"
        );
      });
    });

    describe("on success", () => {
      it("should return the correct order dto", () => {
        // arrange
        const orderId = "111";
        const order: Order = {
          customerId: "111-222",
          orderId: "111",
          orderLines: [
            {
              quantity: 1,
              stockId: "tt-111",
            },
          ],
          created: "2022-03-04T20:47:45.983Z",
          updated: "2022-03-04T20:47:45.983Z",
        };

        awsSdkGetPromiseResponse.mockResolvedValueOnce({ Item: order });

        // act & assert
        return expect(getOrder(orderId)).resolves.toEqual(order);
      });
    });
  });

  describe("createOrder", () => {
    describe("on success", () => {
      it("should return the correct order dto", () => {
        // arrange
        const order: Order = {
          customerId: "111-222",
          orderId: "111",
          orderLines: [
            {
              quantity: 1,
              stockId: "tt-111",
            },
          ],
        };

        // act & assert
        return expect(createOrder(order)).resolves.toMatchInlineSnapshot(`
                  Object {
                    "created": "2022-02-28T00:00:00.000Z",
                    "customerId": "111-222",
                    "orderId": "111",
                    "orderLines": Array [
                      Object {
                        "quantity": 1,
                        "stockId": "tt-111",
                      },
                    ],
                    "updated": "2022-02-28T00:00:00.000Z",
                  }
                `);
      });
    });
  });
});
