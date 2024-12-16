import prismadb from "@/lib/prismadb";
import {ProductsForm} from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/product-form";

const ProductsPage = async (props: {params: Promise<{ productId: string, storeId: string}>}) => {
    const params = await props.params;

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    });

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (

        <div className={"flex-col"}>
            <div className={"flex-1 space-y-4 p-8 pt-6"}>
                <ProductsForm
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                    initialData={product}
                />
            </div>

        </div>
    )
}

export default ProductsPage