export interface Category {
    id: string,
    name: string
}

export interface Post {
    username: string,
    profilePicture: string,
    postID: string,
    title: string,
    description: string,
    category: string,
    image: string,
    likes: number,
    createdAt: Date,
    liked: Boolean
}

export interface Comment {
    id: string,
    username: string,
    profilePicture: string,
    postID: string,
    message: string,
    replies: Comment[],
    likes: number,
    liked: Boolean,
    owned: Boolean,
    createdAt: Date
}

export interface Message {
    id: number,
    type: string,
    icon: string,
    message: string
}