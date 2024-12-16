import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, props: {params: Promise<{storeId: string}>}) {
    const params = await props.params;
    try {
        const {userId} = auth();
        const body = await req.json();

        const { label, imageUrl } = body;
        // verifions si l'utilisateur es connecter pour interagir avec sa billboard
        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if (!imageUrl) {
            return new NextResponse("ImageUrl is required", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse("Store is required", {status: 400})
        }
        // verifions si l'utilisateur a le droit de modifier cette store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }
        // connexion a la base de donnée et création
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);


    } catch (error){
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function GET(req: Request, props: {params: Promise<{storeId: string}>}) {
    const params = await props.params;
    try {


        if (!params.storeId) {
            return new NextResponse("Store is required", {status: 400})
        }
        // connexion a la base de donnée et recupération
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);


    } catch (error){
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}