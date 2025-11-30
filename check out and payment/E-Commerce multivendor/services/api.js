// src/components/api.js

export async function getTestMessage() {
  try {
    const response = await fetch("http://localhost:5000/api/test");
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching message:", error);
    return { message: "Error connecting to backend" };
  }
}
