export interface Document {
  id: string;
  filename: string;
  filepath: string;
  uploaded_by: User;
  created_at: string;
}

export interface User {
  email: string;
  role: string;
}
