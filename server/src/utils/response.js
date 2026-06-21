const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode < 400,
    statusCode,
    message,
  };

  if (data) response.data = data;
  return res.status(statusCode).json(response);
};

export default sendResponse;
