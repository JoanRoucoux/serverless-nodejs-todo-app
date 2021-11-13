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
 * Delete todo
 *
 * @api {post} /todo/delete
 * @apiName Delete todo
 * @apiGroup Todo
 * @apiDescription Delete todo
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
 *       "data": {},
 *       "message": "To-do todo successfully deleted"
 *       "status": "success"
 *     }
 * 
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "todoId": [
                    "Id can't be blank"
                ]
            }
 *      },
 *      "message": "required fields are missing",
 *      "status": "bad request"
 *    }
 *
 *  @apiErrorExample {json} Error-Response: Invalid Id
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": {
 *          "id": "468c8094-a756-4000-a919-example"
 *      },
 *      "message": "Item does not exist",
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
export const deleteTodo: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Destructure request data
  const { todoId } = requestData;

  // Destructure process.env
  const { TODO_TABLE } = process.env;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      return databaseService.getItem({
        key: todoId,
        tableName: TODO_TABLE,
      });
    })
    .then(async () => {
      // Initialise DynamoDB DELETE parameters
      const params = {
        TableName: TODO_TABLE,
        Key: { id: todoId },
      };
      return databaseService.delete(params); // Delete todo
    })
    .then(() => {
      // Set Success Response
      response = new ResponseModel(
        {},
        StatusCode.OK,
        ResponseMessage.DELETE_TODO_SUCCESS
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
          ResponseMessage.DELETE_TODO_FAIL
        );
      }
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
