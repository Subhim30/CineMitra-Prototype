const API_URL = `${import.meta.env.VITE_API_URL}/api/show-seats/`;

export async function getShowSeats(showId) {
  const response = await fetch(`${API_URL}?show=${showId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch seats");
  }

  return response.json();
}