// import { Request, Response } from 'express'; // Mocking Express request/response
// import ProductService from '../../services/product.service';
// import ProductController from '../../controllers/product.controller';

// jest.mock('../../services/product.service');

// describe('ProductService', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let statusMock: jest.Mock;
//   let jsonMock: jest.Mock;
//   let sendMock: jest.Mock;

//   beforeEach(() => {
//     req = {};
//     statusMock = jest.fn(() => res);
//     jsonMock = jest.fn();
//     sendMock = jest.fn();
//     res = {
//       status: statusMock,
//       json: jsonMock,
//       send: sendMock,
//     };
//   });

//   // Test case for getting a valid product by ID
//   it('should return 200 and product for valid product ID', async () => {
//     (ProductService.prototype.getProductById as jest.Mock).mockResolvedValue({
//       _id: '64fdfa9cd98b11e',
//       name: 'Sample Product',
//       rating: 4.5,
//       numOfReviews: 10,
//       price: 100,
//       productImage: 'image.jpg',
//       variations: [
//         {
//           variationName: 'Large',
//           price: 120,
//           discountRate: 10,
//         },
//       ],
//     });

//     req = {
//       params: { id: '64fdfa9cd98b11e' },
//     };

//     await ProductController.getProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(sendMock).toHaveBeenCalledWith({
//       _id: '64fdfa9cd98b11e',
//       name: 'Sample Product',
//       rating: 4.5,
//       numOfReviews: 10,
//       price: 100,
//       productImage: 'image.jpg',
//       variations: [
//         {
//           variationName: 'Large',
//           price: 120,
//           discountRate: 10,
//         },
//       ],
//     });
//   });

//   // Test case for a product not found
//   it('should return 404 if product is not found', async () => {
//     (ProductService.prototype.getProductById as jest.Mock).mockResolvedValue(null);

//     req = {
//       params: { id: 'nonExistentProductId' },
//     };

//     await ProductController.getProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(404);
//     expect(sendMock).toHaveBeenCalledWith({ message: 'Product not found' });
//   });

//   // Test case for updating a product successfully
//   it('should return 200 and the updated product', async () => {
//     const updatedProduct = {
//       _id: '64fdfa9cd98b11e',
//       name: 'Updated Product',
//       price: 150,
//       variations: [
//         {
//           variationName: 'Large',
//           price: 130,
//           discountRate: 15,
//         },
//       ],
//     };

//     (ProductService.prototype.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

//     req = {
//       params: { id: '64fdfa9cd98b11e' },
//       body: { name: 'Updated Product', price: 150 },
//     };

//     await ProductController.updateProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(sendMock).toHaveBeenCalledWith(updatedProduct);
//   });

//   // Test case for updating a product that does not exist
//   it('should return 404 if trying to update a non-existent product', async () => {
//     (ProductService.prototype.updateProduct as jest.Mock).mockResolvedValue(null);

//     req = {
//       params: { id: 'nonExistentProductId' },
//       body: { name: 'Non-Existent Product' },
//     };

//     await ProductController.updateProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(404);
//     expect(sendMock).toHaveBeenCalledWith({ message: 'Product not found' });
//   });

//   // Test case for deleting a product successfully
//   it('should return 200 and success message on product deletion', async () => {
//     (ProductService.prototype.deleteProduct as jest.Mock).mockResolvedValue(true);

//     req = {
//       params: { id: '64fdfa9cd98b11e' },
//     };

//     await ProductController.deleteProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(sendMock).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
//   });

//   // Test case for deleting a product that does not exist
//   it('should return 404 if trying to delete a non-existent product', async () => {
//     (ProductService.prototype.deleteProduct as jest.Mock).mockResolvedValue(null);

//     req = {
//       params: { id: 'nonExistentProductId' },
//     };

//     await ProductController.deleteProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(404);
//     expect(sendMock).toHaveBeenCalledWith({ message: 'Product not found' });
//   });

//   // Complex test case: update product with nested variations and ensure they are updated properly
//   it('should return 200 and updated product with nested variations', async () => {
//     const updatedProduct = {
//       _id: '64fdfa9cd98b11e',
//       name: 'Complex Product',
//       price: 200,
//       variations: [
//         {
//           variationName: 'Medium',
//           price: 180,
//           discountRate: 5,
//         },
//         {
//           variationName: 'Small',
//           price: 150,
//           discountRate: 8,
//         },
//       ],
//     };

//     (ProductService.prototype.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

//     req = {
//       params: { id: '64fdfa9cd98b11e' },
//       body: {
//         name: 'Complex Product',
//         price: 200,
//         variations: [
//           {
//             variationName: 'Medium',
//             price: 180,
//             discountRate: 5,
//           },
//           {
//             variationName: 'Small',
//             price: 150,
//             discountRate: 8,
//           },
//         ],
//       },
//     };

//     await ProductController.updateProduct(req as Request, res as Response);

//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(sendMock).toHaveBeenCalledWith(updatedProduct);
//   });
// });
