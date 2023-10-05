import { User } from "./user";

export interface Post{
    id: string,
    title: string,
    content: string,
    image: string,
    createAt: string,
    user: User,
    sharedPost: Post | null,
    privacy: string,
    numberOfReacts: string,
    numberOfComments: string,
    isReact: boolean
}