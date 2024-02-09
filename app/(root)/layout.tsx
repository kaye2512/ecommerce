import {auth} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function SetupLayout ({children}:{
    children: React.ReactNode;
}){
    const {userId} = auth()
    // redirect to a sign-in if user is not connected
    if(!userId){
        redirect('/sign-in')
    }
    // check if user as a store
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    })
    // redirection vers la dashboard de l'user si il a deja crée un stare
    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    )
}