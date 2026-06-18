export const logout = async() => {
  try {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
        body: JSON.stringify({})
      }
    );
    console.log('res',  response)
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
