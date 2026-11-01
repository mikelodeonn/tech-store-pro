
export function mapUser(u) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    gender: u.gender,
    image: u.image,
  };
}