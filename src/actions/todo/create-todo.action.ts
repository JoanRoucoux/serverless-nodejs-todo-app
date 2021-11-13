import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import 'source-map-support/register';

// Models
import TodoModel from '../../models/todo.model';
import ResponseModel from '../../models/response.model';

// Services
import DatabaseService from '../../services/database.service';

// utils
import { validateAgainstConstraints } from '../../utils/util';

// Define the request constraints
import requestConstraints from '../../constraints/todo/create.constraint.json';

// Enums
import { StatusCode } from '../../enums/status-code.enum';
import { ResponseMessage } from '../../enums/response-message.enum';

/** *
 * Create todo and insert into database
 *
 * @api {post} /todo/create
 * @apiName Create todo
 * @apiGroup Todo
 * @apiDescription Create todo
 *
 * @apiParam {string}           name          The name of the todo
 *
 * @apiSuccess {object}         data
 * @apiSuccess {string}         message       The response message
 * @apiSuccess {string}         status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "name": "My todo",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": { "todoId": "468c8094-a756-4000-a919-974a64b5be8e" },
 *       "message": "todo successfully created"
 *       "status": "success"
 *     }
 * 
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "name": [
                    "Name can't be blank"
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
export const createTodo: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      // Initialise database service
      const databaseService = new DatabaseService();

      // Initialise and hydrate model
      const todoModel = new TodoModel(requestData);

      // Get model data
      const data = todoModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.TODO_TABLE,
        Item: {
          id: data.id,
          name: data.name,
          createdAt: data.timestamp,
          updatedAt: data.timestamp,
        },
      };
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data.id;
    })
    .then((todoId) => {
      // Set Success Response
      response = new ResponseModel(
        { todoId },
        StatusCode.OK,
        ResponseMessage.CREATE_TODO_SUCCESS
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
          ResponseMessage.CREATE_TODO_FAIL
        );
      }
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
