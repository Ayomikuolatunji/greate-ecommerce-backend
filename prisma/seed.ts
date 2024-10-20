import { PrismaClient } from "@prisma/client";
import Chance from "chance";
const prisma = new PrismaClient();

const chance = new Chance();

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function main() {
  const email = "testAminEmail@gmail.com";
  const initials = `${email[0]}}`.toUpperCase();
  const avatar = getRandomColor();
  `https://ui-avatars.com/api/?name=${initials}&background=${getRandomColor}&color=fff&size=128`;
  const adminExist = await prisma.user.findFirst({ where: { userType: "Admin" } });
  if (!adminExist) {
    await prisma.user.create({
      data: {
        email: email,
        password: "123456789",
        avatar: avatar,
        userType: "Admin",
        isVerified: true,
        firstName: "Admin",
        lastName: "great",
      },
    });
  }

  const placeholderImages = [
    "https://picsum.photos/640/480?random=1",
    "https://picsum.photos/640/480?random=2",
    "https://picsum.photos/640/480?random=3",
    "https://picsum.photos/640/480?random=4",
    "https://picsum.photos/640/480?random=5",
    "https://picsum.photos/640/480?random=6",
    "https://picsum.photos/640/480?random=7",
    "https://picsum.photos/640/480?random=8",
    "https://picsum.photos/640/480?random=9",
    "https://picsum.photos/640/480?random=10",
  ];


  const products:any= [];

  for (let i = 0; i < 30; i++) {
    const product = {
      name:
        chance.word({ syllables: 3 }).charAt(0).toUpperCase() +
        chance.word({ syllables: 3 }).slice(1),
      description: chance.sentence({ words: 10 }),
      price: Number(chance.floating({ min: 1, max: 100, fixed: 2 })),
      size: chance.pickone(["S", "M", "L", "XL"]),
      color: chance.color(),
      quantity: chance.integer({ min: 1, max: 100 }),
      salesCoverPicture: chance.pickone(placeholderImages), 
      subImages: [
        chance.pickone(placeholderImages),
        chance.pickone(placeholderImages),
        chance.pickone(placeholderImages),
      ],
    };
    products.push(product);
  }

  await prisma.product.createMany({
    data: products,
  });

  console.log("30 products created");
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
