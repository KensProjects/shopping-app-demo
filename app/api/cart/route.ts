"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const userInfo = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      select: { cart: true },
    });
    await prisma.$disconnect();
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: Request) {
  const { name, price, userId } = await req.json();
  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        price,
        quantity: 1,
        userId: userId,
      },
    });
    await prisma.$disconnect();
    return NextResponse.json(newItem);
  } catch (error) {
    console.error(error);
  }
}

export async function PATCH(req: Request) {
  const { id, userId, type } = await req.json();
  try {
    if (type === "increment") {
      await prisma.item.update({
        where: {
          id,
        },
        data: { quantity: { increment: 1 } },
      });
      const userInfo = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: { cart: true },
      });
      return NextResponse.json(userInfo);
    }
    if (type === "decrement") {
      const reducedItem = await prisma.item.update({
        where: {
          id,
        },
        data: { quantity: { decrement: 1 } },
      });
      if (reducedItem.quantity === 0) {
        await prisma.item.delete({
          where: {
            id,
          },
        });
      }
      const userInfo = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: { cart: true },
      });
      await prisma.$disconnect();
      return NextResponse.json(userInfo);
    }
  } catch (error) {
    console.error(error);
  }
}
