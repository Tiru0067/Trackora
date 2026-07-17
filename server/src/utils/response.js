const sendResponse = (res, { statusCode, code, message, data, errors }) => {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
  };

  if (code) response.code = code;
  if (data !== undefined) response.data = data;
  if (errors !== undefined) response.errors = errors;

  return res.status(statusCode).json(response);
};

export default sendResponse;
