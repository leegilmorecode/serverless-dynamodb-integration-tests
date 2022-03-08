jest.unmock("aws-sdk"); // we actually want to int test against dynamodb and not mock it

import { CreateTableInput, DeleteTableInput } from "aws-sdk/clients/dynamodb";
import { createOrder, getOrder } from "../orders.db.service";

import { DynamoDB } from "aws-sdk";
import { getDynamoDbConfig } from "../../shared/dynamodb-config/get-docclient-config";

const dynamoDb: DynamoDB = new DynamoDB({ ...getDynamoDbConfig() });

describe("orders.db.service", () => {
  beforeAll(async () => {
    // ensure that we are faking the time so the tests are deterministic
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2022, 1, 28));

    // create the table
    const params: CreateTableInput = {
      TableName: "Orders",
      AttributeDefinitions: [
        {
          AttributeName: "orderId",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "orderId",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
      },
    };
    await dynamoDb.createTable(params).promise();
  });

  afterAll(async () => {
    jest.useRealTimers();

    // teardown table after integration tests
    const params: DeleteTableInput = {
      TableName: "Orders",
    };
    await dynamoDb.deleteTable(params).promise();
  });

  describe("getOrder", () => {
    describe("on error", () => {
      it("should throw an error if no item is found in the db", () => {
        // arrange
        const orderId = "222"; // this order does not exist

        // act & assert
        return expect(getOrder(orderId)).rejects.toThrowError(
          "order 222 not found"
        );
      });
    });

    describe("on success", () => {
      it("should return the correct order dto", async () => {
        // arrange
        const order: Order = {
          orderId: "111",
          customerId: "222",
          orderLines: [
            {
              quantity: 100,
              stockId: "tt-123",
            },
          ],
        };

        await createOrder(order);

        // act & assert
        return expect(getOrder(order.orderId)).resolves.toMatchInlineSnapshot(`
                  Object {
                    "created": "2022-02-28T00:00:00.000Z",
                    "customerId": "222",
                    "orderId": "111",
                    "orderLines": Array [
                      Object {
                        "quantity": 100,
                        "stockId": "tt-123",
                      },
                    ],
                    "updated": "2022-02-28T00:00:00.000Z",
                  }
                `);
      });
    });
  });

  describe("createOrder", () => {
    describe("on error", () => {
      it("should throw an error if no order supplied", () => {
        // arrange
        const order: any = null;

        // act & assert
        return expect(createOrder(order)).rejects.toThrowError(
          "no order supplied"
        );
      });
    });

    describe("on success", () => {
      it("should return create and return the correct order dto", async () => {
        // arrange
        const order: Order = {
          orderId: "333",
          customerId: "222",
          orderLines: [
            {
              quantity: 100,
              stockId: "tt-123",
            },
          ],
        };

        await createOrder(order);

        // act & assert
        return expect(getOrder(order.orderId)).resolves.toMatchInlineSnapshot(`
                  Object {
                    "created": "2022-02-28T00:00:00.000Z",
                    "customerId": "222",
                    "orderId": "333",
                    "orderLines": Array [
                      Object {
                        "quantity": 100,
                        "stockId": "tt-123",
                      },
                    ],
                    "updated": "2022-02-28T00:00:00.000Z",
                  }
                `);
      });
    });
  });
});
