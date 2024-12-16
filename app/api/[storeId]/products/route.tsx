import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request, props: {params: Promise<{storeId: string}>}) {
    const params = await props.params;
    try {
        const {userId} = auth();
        const body = await req.json();

        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        // verifions si l'utilisateur es connecter pour interagir avec ses produit
        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        // verification des requete envoyé
        if (!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if (!price) {
            return new NextResponse("Price is required", {status: 400})
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", {status: 400})
        }
        if (!colorId) {
            return new NextResponse("Color id is required", {status: 400})
        }
        if (!sizeId) {
            return new NextResponse("size id is required", {status: 400})
        }
        if (!images || !images.length) {
            return new NextResponse("images are required", {status: 400})
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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                colorId,
                categoryId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);


    } catch (error){
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}


export async function GET(req: Request, props: {params: Promise<{storeId: string}>}) {
    const params = await props.params;
    try {

        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");



        if (!params.storeId) {
            return new NextResponse("Store is required", {status: 400})
        }
        // connexion a la base de donnée et recupération
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);


    } catch (error){
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}