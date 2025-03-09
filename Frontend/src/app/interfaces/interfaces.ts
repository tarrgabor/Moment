export interface Category {
    id: string,
    name: string
}

export interface Post {
    userID: string,
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