import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, {params}: {params: {storeId: string}}){
    try {
        const {userId} = auth();

        const body = await req.json();

        const { name, value } = body;
        // verifions si l'utilisateur es connecter pour interagir avec sa billboard
        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if (!value) {
            return new NextResponse("Value is required", {status: 400})
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
        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);


    } catch (error){
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function GET(req: Request, {params}: {params: {storeId: string}}){
    try {


        if (!params.storeId) {
            return new NextResponse("Store is required", {status: 400})
        }
        // connexion a la base de donnée et recupération
        const size = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);


    } catch (error){
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}