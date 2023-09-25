import { Post } from "./post";
import { User } from "./user";

export interface React{
    id: string,
    type: string,
    user: User,
    userId: string | null,
    post: Post,
    postId: string
}