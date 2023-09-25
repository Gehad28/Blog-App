import { Post } from "./post";
import { User } from "./user";

export interface Comment{
    commentId: string,
    content: string,
    post: Post,
    user: User,
    postId: string,
    userId: string | null  
}