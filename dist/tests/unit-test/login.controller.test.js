"use strict";
// import { Request, Response } from 'express';
// import LoginController from '../../controllers/login.controller';
// import AuthService from '../../services/auth.service';
// jest.mock('../../services/auth.service');
// describe('LoginController', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let statusMock: jest.Mock;
//   let jsonMock: jest.Mock;
//   let sendMock: jest.Mock;
//   let authService: AuthService;
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
//   it('should return 200 and token for valid login', async () => {
//     (authService.authenticateUser as jest.Mock).mockResolvedValue({
//       token: 'validToken',
//       username: 'validUser',
//       name: 'John Doe',
//     });
//     req = {
//       body: {
//         username: 'validUser',
//         password: 'validPassword',
//       },
//     };
//     await LoginController.login(req as Request, res as Response);
//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(sendMock).toHaveBeenCalledWith({
//       token: 'validToken',
//       username: 'validUser',
//       name: 'John Doe',
//     });
//   });
//   it('should return 401 for invalid login', async () => {
//     (authService.authenticateUser as jest.Mock).mockResolvedValue({
//       error: 'Invalid username or password',
//     });
//     req = {
//       body: {
//         username: 'invalidUser',
//         password: 'invalidPassword',
//       },
//     };
//     await LoginController.login(req as Request, res as Response);
//     expect(statusMock).toHaveBeenCalledWith(401);
//     expect(jsonMock).toHaveBeenCalledWith({
//       error: 'Invalid username or password',
//     });
//   });
// });
