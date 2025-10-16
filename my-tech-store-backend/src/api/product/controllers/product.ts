// /**
//  * product controller
//  */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::product.product', ({ strapi }) => ({
//   // Método para actualizar stock después de una compra
//   async updateStock(ctx) {
//     try {
//       const { items } = ctx.request.body;
      
//       if (!items || !Array.isArray(items)) {
//         return ctx.badRequest('Items array is required');
//       }

//       const results: any[] = [];

//       // Actualizar stock para cada producto
//       for (const item of items) {
//         const { productId, quantity } = item;
        
//         if (!productId || !quantity) {
//           results.push({ productId, success: false, error: 'Missing productId or quantity' });
//           continue;
//         }

//         try {
//           // Obtener el producto actual
//           const product = await strapi.entityService.findOne('api::product.product', productId, {
//             fields: ['id', 'stock']
//           });

//           if (!product) {
//             results.push({ productId, success: false, error: 'Product not found' });
//             continue;
//           }

//           // Calcular nuevo stock
//           const newStock = product.stock - quantity;
          
//           if (newStock < 0) {
//             results.push({ productId, success: false, error: 'Insufficient stock' });
//             continue;
//           }

//           // Actualizar el producto
//           const updatedProduct = await strapi.entityService.update('api::product.product', productId, {
//             data: {
//               stock: newStock
//             }
//           });

//           results.push({ 
//             productId, 
//             success: true, 
//             oldStock: product.stock, 
//             newStock: updatedProduct.stock 
//           });

//         } catch (error) {
//           results.push({ productId, success: false, error: error.message });
//         }
//       }

//       // Verificar si todos fueron exitosos
//       const allSuccessful = results.every(result => result.success);
      
//       if (allSuccessful) {
//         return ctx.send({ 
//           success: true, 
//           message: 'Stock updated successfully',
//           results 
//         });
//       } else {
//         return ctx.send({ 
//           success: false, 
//           message: 'Some products could not be updated',
//           results 
//         });
//       }

//     } catch (error) {
//       return ctx.internalServerError(`Error updating stock: ${error.message}`);
//     }
//   }
// }));

//! -------------

/**
 * product controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  // Método para actualizar stock después de una compra
  async updateStock(ctx) {
    try {
      const { items } = ctx.request.body;
      
      console.log('🔄 Updating stock for items:', items);

      if (!items || !Array.isArray(items)) {
        return ctx.badRequest('Items array is required');
      }

      const results: any[] = [];

      // Actualizar stock para cada producto
      for (const item of items) {
        const { productId, quantity } = item;
        
        if (!productId || !quantity) {
          results.push({ productId, success: false, error: 'Missing productId or quantity' });
          continue;
        }

        try {
          // Obtener el producto actual
          const product = await strapi.entityService.findOne('api::product.product', productId, {
            fields: ['id', 'stock', 'name']
          });

          if (!product) {
            results.push({ productId, success: false, error: 'Product not found' });
            continue;
          }

          // Calcular nuevo stock
          const newStock = product.stock - quantity;
          
          if (newStock < 0) {
            results.push({ 
              productId, 
              success: false, 
              error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}` 
            });
            continue;
          }

          // Actualizar el producto
          const updatedProduct = await strapi.entityService.update('api::product.product', productId, {
            data: {
              stock: newStock
            },
            fields: ['id', 'stock', 'name']
          });

          console.log(`✅ Updated ${product.name}: ${product.stock} → ${updatedProduct.stock}`);

          results.push({ 
            productId, 
            success: true, 
            productName: product.name,
            oldStock: product.stock, 
            newStock: updatedProduct.stock 
          });

        } catch (error) {
          console.error(`❌ Error updating product ${productId}:`, error);
          results.push({ productId, success: false, error: error.message });
        }
      }

      // Verificar si todos fueron exitosos
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        return ctx.send({ 
          success: true, 
          message: 'Stock updated successfully',
          results 
        });
      } else {
        const failedUpdates = results.filter(r => !r.success);
        return ctx.send({ 
          success: false, 
          message: 'Some products could not be updated',
          results,
          failedUpdates
        });
      }

    } catch (error) {
      console.error('❌ Error in updateStock:', error);
      return ctx.internalServerError(`Error updating stock: ${error.message}`);
    }
  }
}));