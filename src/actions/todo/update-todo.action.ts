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
import requestConstraints from '../../constraints/todo/update.constraint.json';

// Enums
import { StatusCode } from '../../enums/status-code.enum';
import { ResponseMessage } from '../../enums/response-message.enum';

/** *
 * Update todo and insert into database
 *
 * @api {post} /todo/update
 * @apiName Update todo
 * @apiGroup Todo
 * @apiDescription Update todo
 *
 * @apiParam {string}           todoId        The id of the todo
 * @apiParam {string}           name          The name of the todo
 *
 * @apiSuccess {object}         data
 * @apiSuccess {string}         message       The response message
 * @apiSuccess {string}         status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "todoId": "468c8094-a756-4000-a919-974a64b5be8e",
 *       "name": "My updated todo name",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {},
 *       "message": "todo successfully updated"
 *       "status": "success"
 *     }
 *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
 *              "todoId": [
 *                  "Todo Id can't be blank"
 *              ]
 *              "name": [
 *                  "Name can't be blank"
 *              ]
 *          }
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
export const updateTodo: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure environmental variable
  const { TODO_TABLE } = process.env;

  // Destructure request data
  const { todoId, name } = requestData;

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Item exists
    databaseService.getItem({ key: todoId, tableName: TODO_TABLE }),
  ])
    .then(async () => {
      // Initialise DynamoDB UPDATE parameters
      const params = {
        TableName: TODO_TABLE,
        Key: {
          id: todoId,
        },
        UpdateExpression: 'set #name = :name, updatedAt = :timestamp',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':name': name,
          ':timestamp': new Date().getTime(),
        },
        ReturnValues: 'UPDATED_NEW',
      };
      // Updates Item in DynamoDB table
      return databaseService.update(params);
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel(
        { ...results.Attributes },
        StatusCode.OK,
        ResponseMessage.UPDATE_TODO_SUCCESS
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
          ResponseMessage.UPDATE_TODO_FAIL
        );
      }
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
