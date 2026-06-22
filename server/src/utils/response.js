const sendResponse = (
  res,
  { statusCode, message, data = null, errors = null },
) => {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
  };

  if (data) response.data = data;
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

export default sendResponse;
