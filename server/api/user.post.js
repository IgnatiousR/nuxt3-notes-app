// import { withAccelerate } from "@prisma/extension-accelerate";

export default defineEventHandler(async (event) => {
  // const prisma = usePrismaClient().$extends(withAccelerate());
  const body = await readBody(event);
  const prisma = usePrismaClient();
  // await prisma.user.create({
  //   data: {
  //     email: body.email,
  //     password: body.password,
  //   },
  // });
  console.log(body);
  return { data: "success" };
});
