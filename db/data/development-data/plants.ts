import PlantType from "../../types/plant_type";

const plantsData: PlantType[] = [
  {
    owner_id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d890",
    plant_type_id: 4,
    nickname: "Fernie",
    photo_url: "https://example.com/photos/fernie.jpg",
    profile_description: "A vibrant Boston fern thriving in the living room.",
    notes: "Needs watering every 3 days.",
    status: "alive",
    created_at: "2024-05-01T10:30:00Z",
    died_at: null,
  },
  {
    owner_id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d891",
    plant_type_id: 3,
    nickname: "Spike",
    photo_url: "https://example.com/photos/spike.jpg",
    profile_description: "A resilient cactus with minimal needs.",
    notes: "Water monthly. Keep in bright sunlight.",
    status: "alive",
    created_at: "2023-11-15T08:00:00Z",
    died_at: null,
  },
  {
    owner_id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d890",
    plant_type_id: 4,
    nickname: "Lily",
    photo_url: "https://example.com/photos/lily.jpg",
    profile_description: "Peace lily known for its elegant white blooms.",
    notes: "Keep soil moist. Avoid direct sunlight.",
    status: "dead",
    created_at: "2022-03-10T14:00:00Z",
    died_at: "2024-02-20T09:00:00Z",
  },
];

export default plantsData;
