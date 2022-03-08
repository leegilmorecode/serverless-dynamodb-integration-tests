type Order = {
  orderId: string;
  orderLines: OrderLine[];
  customerId: string;
  created?: string;
  updated?: string;
};

type OrderLine = {
  quantity: number;
  stockId: string;
};
