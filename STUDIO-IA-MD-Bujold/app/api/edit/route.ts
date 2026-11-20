import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.IMAGE_API_KEY || !process.env.IMAGE_API_BASE_URL) {
    return NextResponse.json({
      error: "La retouche IA est en mode aperçu. Connecte un fournisseur d'édition d'images et configure les variables IMAGE_API_KEY et IMAGE_API_BASE_URL dans Vercel."
    }, { status: 503 });
  }
  return NextResponse.json({ error: "Le fournisseur est configuré, mais son format d'API doit être raccordé dans app/api/edit/route.ts." }, { status: 501 });
}