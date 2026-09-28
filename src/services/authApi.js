const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error || "Invalid username or password."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error ||
        data.username?.[0] ||
        data.email?.[0] ||
        data.password?.[0] ||
        "Registration failed."
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}
