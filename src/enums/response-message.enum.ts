export enum ResponseMessage {
  CREATE_TODO_SUCCESS = 'Todo successfully created',
  CREATE_TODO_FAIL = 'Todo cannot be created',
  DELETE_TODO_SUCCESS = 'Todo successfully deleted',
  DELETE_TODO_FAIL = 'Todo cannot be deleted',
  GET_TODO_SUCCESS = 'Todo successfully retrieved',
  GET_TODO_FAIL = 'Todo not found',
  UPDATE_TODO_SUCCESS = 'Todo successfully updated',
  UPDATE_TODO_FAIL = 'Todo cannot be updated',
  ERROR = 'Unknown error',
  INVALID_REQUEST = 'Invalid Request!',
}
