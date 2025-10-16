/**
 * Custom product routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/products/update-stock',
      handler: 'product.updateStock',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};