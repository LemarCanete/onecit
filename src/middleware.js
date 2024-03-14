import { NextRequest, NextResponse } from "next/server";

export function middleware(req) {
  let id = req.cookies.get('id');

  const user = id;
    const url = req.url
    if (!user && url.includes('/Apps')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // if(url.includes('@')){
    //     return NextResponse.redirect(new URL('/Chat', req.url))
    // }

  console.log('User verified (middleware)'); 
  return NextResponse.next();

}
