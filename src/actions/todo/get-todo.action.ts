import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';

// Models
import ResponseModel from '../../models/response.model';

// Services
import DatabaseService from '../../services/database.service';

// utils
import { validateAgainstConstraints } from '../../utils/util';

// Define the request constraints
import requestConstraints from '../../constraints/todo/id.constraint.json';

// Enums
import { StatusCode } from '../../enums/status-code.enum';
import { ResponseMessage } from '../../enums/response-message.enum';

/** *
 * Get todo
 *
 * @api {post} /todo
 * @apiName Get todo
 * @apiGroup Todo
 * @apiDescription Get todo
 *
 * @apiParam {string}         todoId         The id of the todo
 *
 * @apiSuccess {object} data
 * @apiSuccess {string} message       The response message
 * @apiSuccess {string} status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "todoId": "468c8094-a756-4000-a919-974a64b5be8e",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *          "name": "My Wednesday Todo",
 *          "createdAt": 1609383835145,
 *          "id": "468c8094-a756-4000-a919-974a64b5be8e",
 *          "updatedAt": 1609468610216,
 *        },
 *       "message": "todo successfully retrieved"
 *       "status": "success"
 *     }
 * 
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "todoId": [
                    "Todo Id can't be blank"
                ]
            }
 *      },
 *      "message": "required fields are missing",
 *      "status": "bad request"
 *    }
 *
 *  @apiErrorExample {json} Error-Response: Unknown Error
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": {},
 *      "message": "Unknown error",
 *      "status": "error"
 *    }
 */
export const getTodo: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure request data
  const { todoId } = requestData;

  // Destructure process.env
  const { TODO_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      return databaseService.getItem({
        key: todoId,
        tableName: TODO_TABLE,
      });
    })
    .then((data) => {
      // Set Success Response
      response = new ResponseModel(
        { ...data.Item },
        StatusCode.OK,
        ResponseMessage.GET_TODO_SUCCESS
      );
    })
    .catch((error) => {
      // Set Error Response
      if (error instanceof ResponseModel) {
        response = error;
      } else {
        response = new ResponseModel(
          {},
          StatusCode.ERROR,
          ResponseMessage.GET_TODO_FAIL
        );
      }
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
