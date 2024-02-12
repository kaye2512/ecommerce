import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";



export async function GET (req: Request, { params }: { params: {colorId: string}}){
    try {

        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
        }

        // connexion a la base de donnée et recuperation
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,

            }
        })

        return NextResponse.json(color)

    }catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}



export async function PATCH (req: Request, { params }: { params: { storeId: string, colorId: string}}){
    try {

        const { userId} = auth();

        const body = await req.json();

        const {name, value} = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400});
        }

        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
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
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color)

    }catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}

export async function DELETE (req: Request, { params }: { params: {storeId: string, colorId: string}}){
    try {
        const {userId} = auth();


        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }


        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
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
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,

            }
        })

        return NextResponse.json(color)

    }catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});

    }
}


