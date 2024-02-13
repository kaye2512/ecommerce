"use client"

import {Heading} from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import {DataTable} from "@/components/ui/data-table";
import {OrderColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";

// interface qui va contenir notre data props
interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({data}) => {

    return (
        <>
            <div className={"flex items-center justify-between"}>
                <Heading
                    title={`Orders (${data.length})`}
                    description={"Manage Orders for your store"}
                />
            </div>
            <Separator/>
            <DataTable searchKey={"products"} columns={columns} data={data} />

        </>
    )
}