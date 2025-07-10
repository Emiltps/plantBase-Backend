export default interface ProfileType {
  id?: string;
  username: string;
  email: string;
  profile_image: string;
  expo_push_token: string[];
  created_at: string;
}
