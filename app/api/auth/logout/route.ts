import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";



export const POST = async() => {
    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get('accessToken')?.value


        if(accessToken){
            try {
                await fetchWithAuth('/api/v1/admin/auth/logout',{
                    method: 'POST'
                });
            } catch (error) {
                console.error("External API revocation failed, but proceeding with local logout", error);
            }
        }

        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return NextResponse.json({success: true}, {status: 200})
    } catch (error: any) {
        console.error("Logout route error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}