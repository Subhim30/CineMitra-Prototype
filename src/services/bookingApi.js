const API_URL = import.meta.env.VITE_API_URL;

export async function createBooking(showId, showSeatIds, token) {
  const response = await fetch(`${API_URL}/api/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      show: showId,
      show_seats: showSeatIds,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error || "Failed to create booking"
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export async function getMyBookings(token) {
  const response = await fetch(`${API_URL}/api/bookings/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error || "Failed to fetch bookings"
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return Array.isArray(data) ? data : data.results || [];
}