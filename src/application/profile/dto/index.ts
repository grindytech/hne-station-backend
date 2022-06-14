export class UpdateUserDto {
  avatar: Express.Multer.File;
  cover: Express.Multer.File;
  address: string;
  username: string;
  bio: string;
  email: string;
  playerId: string;
}
