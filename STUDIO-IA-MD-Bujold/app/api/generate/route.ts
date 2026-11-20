import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.IMAGE_API_KEY || !process.env.IMAGE_API_BASE_URL) {
    return NextResponse.json({
      error: "Le générateur IA est en mode aperçu. Pour créer de vraies images, il faut connecter un fournisseur d'images IA et ajouter IMAGE_API_KEY et IMAGE_API_BASE_URL dans les variables d'environnement Vercel."
    }, { status: 503 });
  }
  return NextResponse.json({ error: "Le fournisseur est configuré, mais son format d'API doit être raccordé dans app/api/generate/route.ts." }, { status: 501 });
}