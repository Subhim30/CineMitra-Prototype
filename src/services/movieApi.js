const API_URL = `${import.meta.env.VITE_API_URL}/api/movies/`;

export async function getMovies() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
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

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to create movie"
    );
  }

  return data;
}

export async function getMovie(id) {
  const response = await fetch(`${API_URL}${id}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch movie");
  }

  return response.json();
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

  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to update movie"
    );
  }

  return data;
}

export async function deleteMovie(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }
}

export async function getShows() {
  const response = await fetch(
    `${API_URL.replace("/movies/", "/shows/")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }

  return response.json();
}

export async function getShow(id) {
  const response = await fetch(
    `${API_URL.replace("/movies/", "/shows/")}${id}/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch show");
  }

  return response.json();
}

export async function getShowSeats(showId) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/show-seats/?show=${showId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch seats");
  }

  const data = await response.json();

  console.log("DJANGO SHOW SEATS RESPONSE:", data);

  return data;
}
