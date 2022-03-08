import { DynamoDB } from "aws-sdk";
import { getDynamoDbConfig } from "../shared/dynamodb-config/get-docclient-config";

export const TableName = "Orders";

const dynamoDb: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({
  ...getDynamoDbConfig(),
});

export const getOrder = async (orderId: string): Promise<Order> => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName,
    ConsistentRead: true,
    Key: {
      orderId: orderId,
    },
  };

  const { Item: data }: AWS.DynamoDB.DocumentClient.GetItemOutput =
    await dynamoDb.get(params).promise();

  if (!data) throw new Error(`order ${orderId} not found`);

  const order: Order = {
    customerId: data.customerId,
    orderId: data.orderId,
    orderLines: data.orderLines,
    created: data.created,
    updated: data.updated,
  };

  return order;
};

export const createOrder = async (order: Order): Promise<Order> => {
  if (!order) {
    throw new Error("no order supplied");
  }

  const currentISODate = new Date().toISOString();

  const item: Order = {
    ...order,
    created: currentISODate,
    updated: currentISODate,
  };

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName,
    Item: item,
  };

  await dynamoDb.put(params).promise();

  return item;
};

export const service = {
  getOrder,
  createOrder,
};
