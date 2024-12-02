import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logSession } from "../lib/actions/session";

const useAuth = () => {
    const [session, setSession] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const userSession = await logSession();
                setSession(userSession);

                if (!userSession){
                    router.push('/pages/login')
                }
            } catch (error) {
                console.error("Error Fetching Session", error)
            }
        }
        checkSession();
    }, [router])

    return session
}

export default useAuth;