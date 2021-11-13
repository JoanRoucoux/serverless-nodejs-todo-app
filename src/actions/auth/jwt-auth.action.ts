import { APIGatewayAuthorizerEvent, Callback } from 'aws-lambda';

import AuthService from '../../services/auth.service';

export const jwtAuth = async (
  event: APIGatewayAuthorizerEvent,
  callback: Callback
) => {
  const authService = new AuthService();
  let response;
  try {
    response = await authService.authenticate(event);
  } catch (err) {
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
  return response;
};