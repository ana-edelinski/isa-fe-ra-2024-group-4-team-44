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
    comments: [];
    likes: [];
}