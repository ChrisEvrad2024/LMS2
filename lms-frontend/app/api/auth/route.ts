import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/auth/login`, {
      email,
      password
    });

    const { token, user } = response.data;

    const res = NextResponse.json({ user });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}
