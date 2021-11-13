export default {
  jwtAuth: {
    handler: 'handler.jwtAuth',
  },
  basicAuth: {
    handler: 'handler.basicAuth',
  },
  createTodo: {
    handler: 'handler.createTodo',
    events: [
      {
        http: {
          method: 'POST',
          path: 'todo/create',
          authorizer: {
            name: 'jwtAuth',
          },
          cors: true,
        },
      },
    ],
  },
  deleteTodo: {
    handler: 'handler.deleteTodo',
    events: [
      {
        http: {
          method: 'POST',
          path: 'todo/delete',
          authorizer: {
            name: 'jwtAuth',
          },
          cors: true,
        },
      },
    ],
  },
  getTodo: {
    handler: 'handler.getTodo',
    events: [
      {
        http: {
          method: 'post',
          path: 'todo',
          authorizer: {
            name: 'jwtAuth',
          },
          cors: true,
        },
      },
    ],
  },
  updateTodo: {
    handler: 'handler.updateTodo',
    events: [
      {
        http: {
          method: 'POST',
          path: 'todo/update',
          authorizer: {
            name: 'jwtAuth',
          },
          cors: true,
        },
      },
    ],
  },
};
