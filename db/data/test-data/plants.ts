import PlantType from "../../types/plant_type";

const plants: PlantType[] = [
  {
    id: 1,
    owner_id: 1,
    type_id: 4,
    nickname: "Fernie",
    photo_url: "https://example.com/photos/fernie.jpg",
    profile_description: "A vibrant Boston fern thriving in the living room.",
    notes: "Needs watering every 3 days.",
    status: "healthy",
    created_at: "2024-05-01T10:30:00Z",
    died_at: "",
  },
  {
    id: 2,
    owner_id: 2,
    type_id: 3,
    nickname: "Spike",
    photo_url: "https://example.com/photos/spike.jpg",
    profile_description: "A resilient cactus with minimal needs.",
    notes: "Water monthly. Keep in bright sunlight.",
    status: "healthy",
    created_at: "2023-11-15T08:00:00Z",
    died_at: "",
  },
  {
    id: 3,
    owner_id: 1,
    type_id: 4,
    nickname: "Lily",
    photo_url: "https://example.com/photos/lily.jpg",
    profile_description: "Peace lily known for its elegant white blooms.",
    notes: "Keep soil moist. Avoid direct sunlight.",
    status: "dead",
    created_at: "2022-03-10T14:00:00Z",
    died_at: "2024-02-20T09:00:00Z",
  },
];

export default plants;
