import UserType from "../../types/user_type";

const usersData: UserType[] = [
  {
    username: "johndoe",
    email: "johndoe@example.com",
    profile_image: "https://randomuser.me/api/portraits/men/1.jpg",
    expo_push_token: ["ExponentPushToken[abc123]", "ExponentPushToken[def456]"],
    created_at: "2025-07-07T10:00:00Z",
  },
  {
    username: "janedoe",
    email: "janedoe@example.com",
    profile_image: "https://randomuser.me/api/portraits/women/2.jpg",
    expo_push_token: ["ExponentPushToken[ghi789]"],
    created_at: "2025-07-06T15:30:00Z",
  },
  {
    username: "mikesmith",
    email: "mike.smith@example.com",
    profile_image: "https://randomuser.me/api/portraits/men/3.jpg",
    expo_push_token: [],
    created_at: "2025-07-05T08:15:00Z",
  },
  {
    username: "emilyjones",
    email: "emily.jones@example.com",
    profile_image: "https://randomuser.me/api/portraits/women/4.jpg",
    expo_push_token: ["ExponentPushToken[xyz789]", "ExponentPushToken[pqr321]"],
    created_at: "2025-07-04T12:45:00Z",
  },
  {
    username: "alexbrown",
    email: "alex.brown@example.com",
    profile_image: "https://randomuser.me/api/portraits/men/5.jpg",
    expo_push_token: ["ExponentPushToken[lmn456]"],
    created_at: "2025-07-03T09:20:00Z",
  },
];

export default usersData;
