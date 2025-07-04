export interface UserInfoDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
    numberOfPosts: number;
    numberOfFollowing: number;
    likeCount?: number;
    username: string;
  }