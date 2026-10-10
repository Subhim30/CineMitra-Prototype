const API_BASE_URL = import.meta.env.VITE_API_URL;

const MOVIES_API_URL = `${API_BASE_URL}/api/movies/`;
const SHOWS_API_URL = `${API_BASE_URL}/api/shows/`;
const SHOW_SEATS_API_URL = `${API_BASE_URL}/api/show-seats/`;

// =========================
// SHARED REQUEST HANDLER
// =========================

async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    console.error("Network error:", error);

    throw new Error(
      "Unable to connect to the server. Please check your connection and try again."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.error("API error:", {
      status: response.status,
      url,
      data,
    });

    let message = `Request failed with status ${response.status}`;

    if (data?.detail) {
      message = data.detail;
    } else if (data?.error) {
      message = data.error;
    } else if (data?.message) {
      message = data.message;
    } else if (data && typeof data === "object") {
      const messages = Object.values(data)
        .flat()
        .filter(Boolean);

      if (messages.length > 0) {
        message = messages.join(", ");
      }
    }

    throw new Error(message);
  }

  return data;
}

// =========================
// MOVIES
// =========================

export async function getMovies() {
  return request(MOVIES_API_URL);
}

export async function getMovie(id) {
  return request(`${MOVIES_API_URL}${id}/`);
}

export async function createMovie(movie) {
  const formData = new FormData();

  Object.entries(movie).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      formData.append(key, value);
    }
  });

  return request(MOVIES_API_URL, {
    method: "POST",
    body: formData,
  });
}

export async function updateMovie(id, movie) {
  const formData = new FormData();

  Object.entries(movie).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      formData.append(key, value);
    }
  });

  return request(`${MOVIES_API_URL}${id}/`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteMovie(id) {
  await request(`${MOVIES_API_URL}${id}/`, {
    method: "DELETE",
  });

  return true;
}

// =========================
// SHOWS
// =========================

export async function getShows() {
  return request(SHOWS_API_URL);
}

export async function getShow(id) {
  return request(`${SHOWS_API_URL}${id}/`);
}

// =========================
// SHOW SEATS
// =========================

export async function getShowSeats(showId) {
  const data = await request(
    `${SHOW_SEATS_API_URL}?show=${showId}`
  );

  console.log(
    "DJANGO SHOW SEATS RESPONSE:",
    data
  );

  return data;
}
