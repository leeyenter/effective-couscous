export interface UserInterface {
  id: number;
  name: string;
  pic: string;
}

export interface CommentInterface {
  id: number;
  comment: string;
  user: number;
  created: Date;
}
