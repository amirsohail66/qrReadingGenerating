module.exports = {
  success: (status, message, data = null) => {
      // Return the response without the 'errors' field
      return { success: true, status, message, data };
  },
  error: (status, message, errors = null) => {
      // Only include the 'errors' field if 'errors' is not null
      const response = { success: false, status, message };
      if (errors !== null) {
          response.errors = errors;
      }
      return response;
  },
};
