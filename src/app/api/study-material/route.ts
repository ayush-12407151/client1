import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { StudyMaterial } from "@/lib/models/studymaterial.model";

// GET - fetch all materials (authenticated students can see)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const filter: any = {};
    if (type) filter.type = type;

    const materials = await StudyMaterial.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(materials, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// POST - admin only: add new material
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.type || !body.url) {
      return NextResponse.json({ message: "Title, type, and URL are required" }, { status: 400 });
    }

    const material = await StudyMaterial.create({
      title: body.title,
      description: body.description || "",
      type: body.type,
      url: body.url,
      category: body.category || "General",
    });

    return NextResponse.json({ message: "Material added successfully", material }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT - admin only: edit material
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ message: "Material ID is required" }, { status: 400 });
    }

    const updated = await StudyMaterial.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        description: body.description,
        url: body.url,
        category: body.category,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", material: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE - admin only
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await req.json();
    await StudyMaterial.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
