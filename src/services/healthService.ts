import { prisma } from "../lib/prisma";

const checkHealth = async () => {
  const systemHealth = await prisma.systemHealth.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  if (!systemHealth) {
    await prisma.systemHealth.create({
      data: {
        isHealth: true,
      },
    });
  }

  return systemHealth;
};

export { checkHealth };
