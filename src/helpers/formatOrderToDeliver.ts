import { Order } from 'src/schemas/order.schema';

export function offersToDeliver(orders: Array<Order>) {
  const ordersToDeliver = [];
  let productsToDeliver = [];

  for (const order of orders) {
    const orderDeliver = {
      order_id: order._id,
      name: order?.user?.full_name,
      total: `$${order.cart.total_price} ${order.payment_type}`,
      products: order.cart?.subproducts.map((elem) => {
        return `\n${elem.quantity} x ${elem.subproduct.product.name} ${elem.subproduct.size}kg`;
      }),
      direction: `${order.address.street} ${order.address.number} depto: ${order.address.flat} piso: ${order.address.floor} extra: ${order.address.extra}`,
    };
    productsToDeliver = [
      ...productsToDeliver,
      order.cart?.subproducts?.map((elem) => {
        return `\n${elem.quantity} x ${elem.subproduct.product.name} ${elem.subproduct.size}kg`;
      }),
    ];
    ordersToDeliver.push(orderDeliver);
  }
  return {
    orders: ordersToDeliver,
    products: productsToDeliver.flat(Infinity),
  };
}
