
import prismadb from "@/lib/prismadb";

import {format} from "date-fns";
import {ProductsColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";
import {ProductClient} from "@/app/(dashboard)/[storeId]/(routes)/products/components/client";
import {formater} from "@/lib/utils";

// params c'est pour determiné l'id qui est connecté a ma billboards la reference est situé dans nos folders [] en nextjs
const ProductsPage = async ({params}: {params: {storeId: string}}) => {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts: ProductsColumn[] = products.map((item) => ({

        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formater.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),

    }))

    return (
        <div className={"flex-col"}>
            <div className={"flex-1 space-y-4 p-8 pt-6"}>
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    );
};

export default ProductsPage;