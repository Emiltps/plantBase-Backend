type PlantStatus = "alive" | "dead" | "infected";

export default interface PlantType {
  plant_id?: number;
  owner_id?: string;
  plant_type_id: number;
  nickname: string;
  photo_url?: string;
  profile_description?: string;
  notes?: string;
  status?: PlantStatus;
  created_at?: string;
  died_at?: string | null;
}
