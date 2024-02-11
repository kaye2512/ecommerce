"use client"
import React from 'react';
import {useParams} from "next/navigation";
import {useOrigin} from "@/hooks/use-origin";
import {ApiAlert} from "@/components/ui/api-alert";

interface ApiListPros {
    entityName: string;
    entityIdName: string;
}
const ApiList: React.FC<ApiListPros> = ({entityName, entityIdName}) => {

    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/${params.storeId}`
    return (
        <>
            <ApiAlert
                title={"Get"}
                description={`${baseUrl}/${entityName}`}
                variant={"public"}
            />
            <ApiAlert
                title={"Get"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"public"}
            />
            <ApiAlert
                title={"POST"}
                description={`${baseUrl}/${entityName}`}
                variant={"admin"}
            />
            <ApiAlert
                title={"PATCH"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"admin"}
            />
            <ApiAlert
                title={"DELETE"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"admin"}
            />
        </>
    );
};

export default ApiList;