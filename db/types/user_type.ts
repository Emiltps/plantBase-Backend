export default interface User {
  id: number;
  username: string;
  email: string;
  profile_image: string;
  expo_push_token: string[];
  created_at: string;
}
