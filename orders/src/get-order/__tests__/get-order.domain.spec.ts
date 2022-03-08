import { getOrder } from "../get-order.domain";
import { service } from "../../services/orders.db.service";

describe("get-order.domain", () => {
  describe("on error", () => {
    it("should throw an error if no order lines on the order", () => {
      // arrange
      const spy = jest.spyOn(service, "getOrder");

      const orderId = "111";
      const order: Order = {
        customerId: "222",
        orderId: "111",
        created: "2022-02-28T00:00:00.000Z",
        updated: "2022-02-28T00:00:00.000Z",
        orderLines: [], // no orderlines
      };

      spy.mockResolvedValueOnce(order);

      // act & assert
      return expect(getOrder(orderId)).rejects.toThrowError(
        "no order lines on order 111"
      );
    });

    it("should throw an error if b2b order is returned", () => {
      // arrange
      const spy = jest.spyOn(service, "getOrder");

      const orderId = "111";
      const order: Order = {
        customerId: "xxx-222", // customerId begins with xxx
        orderId: "111",
        orderLines: [
          {
            quantity: 1,
            stockId: "tt-111",
          },
        ],
        created: "2022-02-28T00:00:00.000Z",
        updated: "2022-02-28T00:00:00.000Z",
      };

      spy.mockResolvedValueOnce(order);

      // act & assert
      return expect(getOrder(orderId)).rejects.toThrowError(
        "order 111 is a B2B order"
      );
    });
  });

  describe("on success", () => {
    it("should return the correct order dto", () => {
      // arrange
      const spy = jest.spyOn(service, "getOrder");

      const orderId = "111";
      const order: Order = {
        customerId: "111-222",
        orderId: "111",
        created: "2022-02-28T00:00:00.000Z",
        updated: "2022-02-28T00:00:00.000Z",
        orderLines: [
          {
            quantity: 1,
            stockId: "tt-111",
          },
        ],
      };

      spy.mockResolvedValueOnce(order);

      // act & assert
      return expect(getOrder(orderId)).resolves.toEqual(order);
    });
  });
});
