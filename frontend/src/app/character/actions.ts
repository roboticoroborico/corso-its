import { cookies } from "next/headers";

// getCharacters
export const getCharacters = async () => {
  const sessionId = (await cookies()).get("sessionId")?.value;

  const response = await fetch(`${process.env.API_BACKEND_URL}/character`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.API_BACKEND_TOKEN,
      Cookie: `sessionId=${sessionId}`,
    },
    credentials: "include",
    next: {
      tags: ["characters"],
    },
  });

  return response.json();
};

// getClasses

// getSkills
