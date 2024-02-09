import React from "react";
import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";


// this way we can get navbar in every root
export default async function DashboardLayout ({children, params}:{
    children: React.ReactNode;
    params: {storeId: string}
}){
    // verifi si l'utilisateur est connecté
    const { userId } = auth();

    // if not redirige vers le login
    if (!userId) {
        redirect('/sign-in');
    }

    // verifie si l'utilisateur a une store
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    // if not store redirige vers l'acceuil de création de store le modal
    if (!store) {
        redirect('/');
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}