import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";



export async function POST (request:NextRequest){
    const {email, password} = await request.json();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    try {
        const backendResponse = await fetch(`${BASE_URL}/api/v1/admin/auth/login`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' },
            body: JSON.stringify({email, password})
        });

        const data = await backendResponse.json();


        if(!backendResponse.ok){
            return NextResponse.json(
                {success: false, message: data.message || 'login failed'},
                {status: backendResponse.status}
            );
        };

        const isProduction = process.env.NODE_ENV === 'production';

        const {accessToken, refreshToken} = data.data

        const cookieStore = await cookies();

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            maxAge: 60 * 60, // 1hr
            path: '/'
        })

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
             maxAge: 60 * 60 * 24 * 7, 
            path: '/'
        })


        return NextResponse.json({message: data.message, admin: data.data.admin})
    } catch (error) {
        console.error('API ERROR', error);
        return NextResponse.json(
            { success: false, message: "Internal error. Try again later." },
            { status: 500 }
        )
    }
}