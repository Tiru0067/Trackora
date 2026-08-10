const sendResponse = (
  res,
  { statusCode, code, message, data, pagination, errors },
) => {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
  };

  if (code) response.code = code;
  if (data !== undefined) response.data = data;
  if (pagination !== undefined) response.pagination = pagination;
  if (errors !== undefined) response.errors = errors;

  return res.status(statusCode).json(response);
};

export default sendResponse;
