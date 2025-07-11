export default interface ProfileType {
  id?: string;
  username: string;
  email: string;
  full_name: string;
  profile_image: string;
  expo_push_token: string[];
  created_at: string;
}
