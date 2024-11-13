import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import Chance from "chance";
const prisma = new PrismaClient();


function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function getSalt(): Promise<string> {
  return await bcrypt.genSalt(10);
}

async function hash(value: string): Promise<string> {
  const salt = await getSalt();
  return await bcrypt.hash(value, salt);
}

async function main() {
  const email = "admin@gmail.com";
  const initials = `${email[0]}}`.toUpperCase();
  const avatar = getRandomColor();
  `https://ui-avatars.com/api/?name=${initials}&background=${getRandomColor}&color=fff&size=128`;
  const adminExist = await prisma.user.findFirst({ where: { userType: "Admin" } });
  if (!adminExist) {
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hash("123456789"),
        avatar: avatar,
        userType: "Admin",
        isVerified: true,
        firstName: "Admin",
        lastName: "great",
      },
    });
  } else {
    await prisma.user.delete({ where: { id: adminExist.id } });
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: await hash("123456789"),
        avatar: avatar,
        userType: "Admin",
        isVerified: true,
        firstName: "Admin",
        lastName: "great",
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
