"use client"

import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {DataTable} from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";
import {columns, ProductsColumn} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

// interface qui va contenir notre data props
interface ProductClientProps {
    data: ProductsColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({data}) => {
    const router = useRouter()
    const params= useParams()

    return (
        <>
            <div className={"flex items-center justify-between"}>
                <Heading
                    title={`Products (${data.length})`}
                    description={"Manage product for your store"}
                />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className={"mr-2 h-4 w-4"}/>
                    Add New
                </Button>
            </div>
            <Separator/>
            <DataTable searchKey={"label"} columns={columns} data={data} />
            <Heading title={"Api"} description={"Api calls for products"}/>
            <Separator/>
            <ApiList
                entityName={"products"}
                entityIdName={"productId"}
            />



        </>
    )
}