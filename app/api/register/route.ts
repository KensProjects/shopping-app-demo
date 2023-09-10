"use server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    if (!username || !password) {
      return NextResponse.json({ message: "Please fill all fields." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userExists) {
      throw new Error("Registration error!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        cart: {
          create: [],
        },
      },
      include: { cart: true },
    });
    await prisma.$disconnect();

    return NextResponse.json(user);
  } catch (error) {
    throw new Error("Registration error!")
  }
}
