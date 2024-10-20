import bcrypt from "bcryptjs";
import { IHashingService } from ".";

export class BcryptHashingService implements IHashingService {
  private async getSalt(): Promise<string> {
    return await bcrypt.genSalt(10);
  }

  async hash(value: string): Promise<string> {
    const salt = await this.getSalt();
    return await bcrypt.hash(value, salt);
  }

  async verify(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  isHashed(value: string): boolean {
    return value.startsWith("$argon2");
  }

  generateAvatar(email: string): string {
    const initials = `${email[0]}}`.toUpperCase();
    const backgroundColor = this.getRandomColor();
    return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=fff&size=128`;
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
