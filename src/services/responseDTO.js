function createResponse(success, data, message) {
  return {
    success,
    data,
    message,
  };
}

module.exports = createResponse;
