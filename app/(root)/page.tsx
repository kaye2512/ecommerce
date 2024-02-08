"use client"
import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import {Modal} from "@/components/ui/modal";

export default function SetupPage() {
    return (
        <>
            <div className={"p-4"}>
                <Modal isOpen={true} onClose={() => {}} description={"test"} title={"text"}>
                    Children
                </Modal>
            </div>

        </>
    );
}
