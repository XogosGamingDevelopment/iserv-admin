export function checkUserLoggedIn(): boolean {
  const token = localStorage.getItem("token"); // Safely retrieve the token
  return Boolean(token && token !== null); // Return true if the token exists
}
