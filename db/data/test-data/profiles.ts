import ProfileType from "../../types/profile_type";

const profilesData: ProfileType[] = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    username: "testuser",
    email: "test@example.com",
    full_name: "Test User",
    profile_image: "",
    expo_push_token: [],
    created_at: new Date().toISOString(),
  },
  {
    id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d890",
    username: "johndoe",
    email: "johndoe@example.com",
    full_name: "John Doe",
    profile_image: "https://randomuser.me/api/portraits/men/1.jpg",
    expo_push_token: ["ExponentPushToken[abc123]", "ExponentPushToken[def456]"],
    created_at: "2025-07-07T10:00:00Z",
  },
  {
    id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d891",
    username: "janedoe",
    email: "janedoe@example.com",
    full_name: "Jane Doe",
    profile_image: "https://randomuser.me/api/portraits/women/2.jpg",
    expo_push_token: ["ExponentPushToken[ghi789]"],
    created_at: "2025-07-06T15:30:00Z",
  },
  {
    id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d892",
    username: "mikesmith",
    email: "mike.smith@example.com",
    full_name: "Mike Smith",
    profile_image: "https://randomuser.me/api/portraits/men/3.jpg",
    expo_push_token: [],
    created_at: "2025-07-05T08:15:00Z",
  },
  {
    id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d893",
    username: "emilyjones",
    email: "emily.jones@example.com",
    full_name: "Emily Jones",
    profile_image: "https://randomuser.me/api/portraits/women/4.jpg",
    expo_push_token: ["ExponentPushToken[xyz789]", "ExponentPushToken[pqr321]"],
    created_at: "2025-07-04T12:45:00Z",
  },
  {
    id: "12e3f4a5-b6c7-4d89-8e01-23f45c67d894",
    username: "alexbrown",
    email: "alex.brown@example.com",
    full_name: "Alex Brown",
    profile_image: "https://randomuser.me/api/portraits/men/5.jpg",
    expo_push_token: ["ExponentPushToken[lmn456]"],
    created_at: "2025-07-03T09:20:00Z",
  },
];

export default profilesData;
