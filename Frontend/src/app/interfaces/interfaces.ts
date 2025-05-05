export interface Category {
    id: string,
    name: string,
    isSelected: boolean
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
    liked: Boolean,
    owned: Boolean
}

export interface User {
    username: string,
    profilePicture: string;
    followerCount: number
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

export interface Option
{
  id: string,
  text: string
}