module.exports = {
  success: (status, message, data = null) => {
      return { success: true, status, message, data };
  },
  error: (status, message, errors = null) => {
      const response = { success: false, status, message };
      if (errors !== null) {
          response.errors = errors;
      }
      return response;
  },
};
