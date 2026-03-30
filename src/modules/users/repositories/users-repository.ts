export type CreateUserRepositoryInput = {
  name: string;
  email: string;
  password: string;
};

export type UserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserRepositoryInput): Promise<UserEntity>;
}
