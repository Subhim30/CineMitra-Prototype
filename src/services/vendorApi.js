const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

export async function getVendorBranches() {
  const response = await fetch(
    `${API_URL}/api/vendor/branches/`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to fetch branches."
    );
  }

  return Array.isArray(data)
    ? data
    : data.results || [];
}

export async function createVendorBranch(branch) {
  const response = await fetch(
    `${API_URL}/api/vendor/branches/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(branch),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to create branch."
    );
  }

  return data;
}

export async function updateVendorBranch(
  id,
  branch
) {
  const response = await fetch(
    `${API_URL}/api/vendor/branches/${id}/`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(branch),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to update branch."
    );
  }

  return data;
}

export async function deleteVendorBranch(id) {
  const response = await fetch(
    `${API_URL}/api/vendor/branches/${id}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ||
        data.error ||
        "Failed to delete branch."
    );
  }
}

export async function getVendorHalls() {
  const response = await fetch(
    `${API_URL}/api/vendor/halls/`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to fetch halls."
    );
  }

  return Array.isArray(data)
    ? data
    : data.results || [];
}


export async function createVendorHall(hall) {
  const response = await fetch(
    `${API_URL}/api/vendor/halls/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(hall),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        data.branch?.[0] ||
        "Failed to create hall."
    );
  }

  return data;
}


export async function updateVendorHall(id, hall) {
  const response = await fetch(
    `${API_URL}/api/vendor/halls/${id}/`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(hall),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to update hall."
    );
  }

  return data;
}


export async function deleteVendorHall(id) {
  const response = await fetch(
    `${API_URL}/api/vendor/halls/${id}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ||
        data.error ||
        "Failed to delete hall."
    );
  }
}

export async function getVendorSeats() {
  const response = await fetch(
    `${API_URL}/api/vendor/seats/`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        "Failed to fetch seats."
    );
  }

  return Array.isArray(data)
    ? data
    : data.results || [];
}


export async function createVendorSeat(seat) {
  const response = await fetch(
    `${API_URL}/api/vendor/seats/`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(seat),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        data.hall?.[0] ||
        data.non_field_errors?.[0] ||
        "Failed to create seat."
    );
  }

  return data;
}


export async function updateVendorSeat(id, seat) {
  const response = await fetch(
    `${API_URL}/api/vendor/seats/${id}/`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(seat),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.error ||
        data.non_field_errors?.[0] ||
        "Failed to update seat."
    );
  }

  return data;
}


export async function deleteVendorSeat(id) {
  const response = await fetch(
    `${API_URL}/api/vendor/seats/${id}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      data.detail ||
        data.error ||
        "Failed to delete seat."
    );
  }
}

