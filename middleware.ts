import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jose from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log({ token });

  if (!token) {
    console.error('JWT Invalid or not signed');
    const { protocol, host, pathname } = req.nextUrl;

    // return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
  }

  return NextResponse.next();
  // if (req.nextUrl.pathname.startsWith('/checkout')) {
  //   const token = req.cookies.get('token');

  //   try {
  //     await jose.jwtVerify(token || '', new TextEncoder().encode(process.env.JWT_SECRET_SEED || ''));
  //     //If no error is thrown, the JWT is valid, you can even the payload if necessary
  //     return NextResponse.next();
  //   } catch (error) {
  //     console.error(`JWT Invalid or not signed in`, { error });
  //     const { protocol, host, pathname } = req.nextUrl;

  //     return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
  //   }
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/checkout/:path*',
};
