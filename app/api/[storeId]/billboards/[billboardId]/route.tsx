import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";



export async function GET (req: Request, { params }: { params: {storeId: string, billboardId: string}}){
    try {

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
        }

        // connexion a la base de donnée et recuperation
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,

            }
        })

        return NextResponse.json(billboard)

    }catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}



export async function PATCH (req: Request, { params }: { params: { storeId: string, billboardId: string}}){
    try {
        const {userId} = auth();
        const body = await req.json();

        const {label, imageUrl} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!label) {
            return new NextResponse("label is required", { status: 400});
        }

        if (!imageUrl) {
            return new NextResponse("ImageUrl is required", { status: 400});
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
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

        // connexion a la base de donnée et update
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)

    }catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}

export async function DELETE (req: Request, { params }: { params: {storeId: string, billboardId: string}}){
    try {
        const {userId} = auth();


        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }


        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400})
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

        // connexion a la base de donnée et Delete
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,

            }
        })

        return NextResponse.json(billboard)

    }catch (error) {
        console.log('[BILLBOARDS_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}


