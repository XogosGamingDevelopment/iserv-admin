export function getUserInfo(key: string): string | undefined {
  const authtoken = localStorage.getItem("token");
  if (authtoken) {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        //console.log('local storage user', user)
        switch (key) {
          case "user_image":
            return user.profile_image_path;
          case "id":
            return user.id;
          case "fullname":
            return user.fullname;
          case "email":
            return user.email;
          case "phone_no":
            return user.phone_no;
          case "role":
            return user.role_id;
          case "verified":
            return user.verified;
          case "rolename":
            return user.rolename;
          default:
            console.warn(`Unknown key requested: ${key}`);
            return undefined;
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        return undefined;
      }
    }
  }
  return "";
}
