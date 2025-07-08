export interface Post {
    id: number;
    creatorId: number;
    creatorUsername: string;
    description: string;
    creationTime: Date;
    imagePath: string;
    //location id
    locationStreet: string;
    locationCity: string;
    locationPostalCode: string;
    locationLatitude: number ;
    locationLongitude: number ;
    comments: Comment[];
    likes: [];
    likeCount: number;
}

export interface Comment {
    id: number;
    text: string;
    creationTime: Date;
    userId: number;
    username: string;
    postId: number;
}