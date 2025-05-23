const logOutUser = async () => {
  const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/user/logout`;

  // const apiUrl = process.env.NEXT_APP_API_URL
  //   ? `${process.env.NEXT_APP_API_URL}/api/v1/user/logout`
  //   : `https://unikitab-backend-4.onrender.com/api/v1/user/logout`;
  const token = localStorage.getItem("accessToken");
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  localStorage.clear();
  return response;
};

const logInUser = async (params: { username: string; password: string }) => {
  const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/user/login`;
  // const apiUrl = process.env.NEXT_APP_API_URL
  //   ? `${process.env.NEXT_APP_API_URL}/api/v1/user/login`
  //   : `https://unikitab-backend-4.onrender.com/api/v1/user/login`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(params),
  });
  return response.json();
};

const createAccount = async (params: {
  username: string;
  email: string;
  password: string;
}) => {
  const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/user/signUp`;
  // const apiUrl = process.env.NEXT_APP_API_URL
  //   ? `${process.env.NEXT_APP_API_URL}/api/v1/user/signUp`
  //   : `https://unikitab-backend-4.onrender.com/api/v1/user/signUp`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response;
};

const logInCheck = async (token: string) => {
  const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/user/login-check`;

  // const apiUrl = process.env.NEXT_APP_API_URL
  //   ? `${process.env.NEXT_APP_API_URL}/api/v1/user/login-check`
  //   : `https://unikitab-backend-4.onrender.com/api/v1/user/login-check`;
  const response = await fetch(apiUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

const getUserProfile = async () => {
  const apiUrl = `https://unikitab-backend-4.onrender.com/api/v1/user/user-profile`;

  // const apiUrl = process.env.NEXT_APP_API_URL
  //   ? `${process.env.NEXT_APP_API_URL}/api/v1/user/user-profile`
  //   : `https://unikitab-backend-4.onrender.com/api/v1/user/user-profile`;

  const token = localStorage.getItem("accessToken");
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export { logOutUser, logInUser, logInCheck, getUserProfile, createAccount };
