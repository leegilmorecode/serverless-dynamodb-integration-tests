import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { getOrder } from "./get-order.domain";
import { logger } from "../shared/logger";

export const getOrderHandler: APIGatewayProxyHandler = async ({
  pathParameters,
}: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  logger.info("get-order.handler - started");

  try {
    if (!pathParameters || !pathParameters.id) {
      throw new Error("Order Id not defined");
    }

    const orderId = pathParameters["id"];

    logger.info(`get-order.handler - get order ${orderId}`);

    const response: Order = await getOrder(orderId);

    return {
      body: JSON.stringify(response),
      statusCode: 200,
    };
  } catch (error) {
    logger.error(`get-order.handler - ${error}`);
    return {
      body: "An error has occurred",
      statusCode: 500,
    };
  }
};
