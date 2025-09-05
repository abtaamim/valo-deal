
const USER_ROLE = ['user', 'business', 'admin'];
const PRODUCT_CONDITION = ['new', 'used', 'refubrished'];
const PRODUCT_STATUS = ['pending', 'approved', 'rejected', 'suspended', 'stock_out'];
const ORDER_STATUS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'returned', 'failed'];
const DELIVERY_STATUS = ['pending', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return'];
const STOCK_UPDATE_TYPE = ['restock', 'sale', 'return', 'adjustment'];
const NOTIFICATION_TYPE = [
  'order_placed', 'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled',
  'payment_success', 'payment_failed', 'refund_initiated', 'refund_completed',
  'product_approved', 'product_rejected', 'product_sold', 'low_stock_warning',
  'admin_announcement', 'system_alert', 'promotion', 'discount_offer',
  'wishlist_back_in_stock', 'new_message', 'review_received', 'feedback_request'
];
const PAYMENT_METHOD = ['cod', 'bkash', 'nagad', 'card', 'bank_transfer'];
const PAYMENT_STATUS = ['pending', 'success', 'failed', 'refunded', 'cancelled'];

module.exports = {
  USER_ROLE,
  PRODUCT_CONDITION,
  PRODUCT_STATUS,
  ORDER_STATUS,
  DELIVERY_STATUS,
  STOCK_UPDATE_TYPE,
  NOTIFICATION_TYPE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
};
