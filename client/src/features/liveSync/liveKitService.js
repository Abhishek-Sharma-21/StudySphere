const API_URL = "http://localhost:3000/api/live-sync";

/**
 * Fetch a LiveKit Access Token from the backend.
 * @param {string} authToken - User's authorization token.
 * @param {object} sessionData - { roomName, participantName, isAdmin }
 */
export const fetchLiveSyncToken = async (authToken, { roomName, participantName, isAdmin }) => {
  try {
    const response = await fetch(`${API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ roomName, participantName, isAdmin }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch synchronization token.");
    }

    return data; // Returns { token, serverUrl }
  } catch (error) {
    console.error("LiveSync Service Error:", error);
    throw error;
  }
};

/**
 * Admin Ejection Protocol
 */
export const kickParticipantFromCall = async (authToken, { roomName, participantIdentity }) => {
  const response = await fetch(`${API_URL}/kick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ roomName, participantIdentity })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to eject participant.");
  return data;
};

/**
 * Admission Control: Request to join a call
 */
export const requestCallEntry = async (authToken, { roomName }) => {
  const response = await fetch(`${API_URL}/request-entry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ roomName })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
};

/**
 * Admission Control: Get Waiting Room (Admins Only)
 */
export const getCallWaitingRoom = async (authToken, roomName) => {
  const response = await fetch(`${API_URL}/waiting-room/${roomName}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch queue.");
  return data;
};

/**
 * Admission Control: Admit or Deny node
 */
export const admitParticipantNode = async (authToken, { roomName, targetUserId, action }) => {
  const response = await fetch(`${API_URL}/admit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ roomName, targetUserId, action })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Handshake failed.");
  return data;
};
