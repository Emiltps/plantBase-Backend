export default interface PlantType {
  id: number;
  owner_id: number;
  type_id: number;
  nickname: string;
  photo_url: string;
  profile_description: string;
  notes: string;
  status: string;
  created_at: string;
  died_at: string;
}
