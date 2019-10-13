/**
 * @param {Object} params
 * @returns {Response}
 */
const createResponse = params => {
  const { response, code, success, message, data = {}, error = {} } = params;

  return response.status(code).json({
    success,
    message,
    data,
    error,
  });
};

/**
 * @param {Response} response
 * @param {string} message
 * @param {*} data
 * @param {string|number} code
 * @returns {Response}
 */
const createSuccessResponse = (
  response,
  message = 'Success',
  data = {},
  code = 200,
) =>
  createResponse({
    response,
    code,
    success: true,
    message,
    data,
  });

/**
 * @param {Request} request
 * @param {Response} response
 * @param {string} message
 * @param {*} error
 * @param {string|number} code
 * @returns {Response}
 */
const createErrorResponse = (
  request,
  response,
  message = 'Server Internal Error',
  error = {},
  code = 500,
) => {
  console.log(error);
  return createResponse({
    response,
    code,
    success: false,
    message,
    error,
  });
};

/**
 * @param {Request} request
 * @param {Response} response
 * @param {*} error
 * @param {string} message
 * @param {string|number} code
 * @returns {Response}
 */
const createAccessDeniedResponse = (
  request,
  response,
  error = {},
  message = 'Sorry you do not have permission anymore',
  code = 403,
) => {
  request.log.error({ err: error }, message);

  return createResponse({
    response,
    code,
    success: false,
    message,
    error,
  });
};

export {
  createResponse,
  createSuccessResponse,
  createErrorResponse,
  createAccessDeniedResponse,
};
