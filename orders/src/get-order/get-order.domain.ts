import { logger } from "../shared/logger";
import { service } from "../services/orders.db.service";

// this is the main domain logic which can be utilised by any other interfaces
export const getOrder = async (orderId: string): Promise<Order> => {
  try {
    // service layer can be mocked easily or swapped out for same interface (underlying technology doesnt matter)
    const order: Order = await service.getOrder(orderId);

    // additional basic domain logic
    if (!order.orderLines.length) {
      throw new Error(`no order lines on order ${orderId}`);
    }

    // additional basic domain logic
    if (order.customerId.startsWith("xxx")) {
      throw new Error(`order ${orderId} is a B2B order`);
    }

    return order;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
