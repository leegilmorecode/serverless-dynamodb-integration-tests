import * as orderDomain from "../get-order.domain";

import { mockCallback, mockContext, mockEvent } from "../../../jest-setup";

import { APIGatewayEvent } from "aws-lambda";
import { getOrderHandler } from "../get-order.handler";

let event: APIGatewayEvent;

describe("get-order.handler", () => {
  beforeEach(() => {
    event = {
      ...mockEvent,
      pathParameters: {
        id: "111",
      },
    };
  });

  describe("on error", () => {
    it("should throw an error if no path params on event", () => {
      // arrange
      event.pathParameters = null;

      // act & assert
      return expect(getOrderHandler(event, mockContext, mockCallback)).resolves
        .toMatchInlineSnapshot(`
                Object {
                  "body": "An error has occurred",
                  "statusCode": 500,
                }
              `);
    });

    it("should throw an error if no id on path params in event", () => {
      // arrange
      delete event?.pathParameters?.id;

      // act & assert
      return expect(getOrderHandler(event, mockContext, mockCallback)).resolves
        .toMatchInlineSnapshot(`
                  Object {
                    "body": "An error has occurred",
                    "statusCode": 500,
                  }
                `);
    });
  });

  describe("on success", () => {
    it("should return the correct values", () => {
      const spy = jest.spyOn(orderDomain, "getOrder");

      // arrange
      const order: Order = {
        customerId: "111",
        orderId: "222",
        orderLines: [
          {
            quantity: 23,
            stockId: "tt-123",
          },
        ],
        created: "2022-02-28T00:00:00.000Z",
        updated: "2022-02-28T00:00:00.000Z",
      };

      spy.mockResolvedValueOnce(order);

      // act & assert
      return expect(getOrderHandler(event, mockContext, mockCallback)).resolves
        .toMatchInlineSnapshot(`
                Object {
                  "body": "{\\"customerId\\":\\"111\\",\\"orderId\\":\\"222\\",\\"orderLines\\":[{\\"quantity\\":23,\\"stockId\\":\\"tt-123\\"}],\\"created\\":\\"2022-02-28T00:00:00.000Z\\",\\"updated\\":\\"2022-02-28T00:00:00.000Z\\"}",
                  "statusCode": 200,
                }
              `);
    });
  });
});
