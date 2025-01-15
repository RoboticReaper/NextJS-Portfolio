'use client'
 
import { useRouter } from 'next/navigation'
import {Button} from "@nextui-org/button";

export default function Custom404() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-base text-center justify-center">
                404 - Page Not Found
            </div>
            <Button onPress={() => router.push('/')} color="primary">Go back home</Button>
        </div>
    );
}