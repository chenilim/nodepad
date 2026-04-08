import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { _baseUrl, _headers, ...payload } = body

    if (!_baseUrl) {
      return NextResponse.json({ error: "Missing _baseUrl" }, { status: 400 })
    }

    const response = await fetch(`${_baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ..._headers,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.text()
      return new NextResponse(err, { status: response.status })
    }

    const data = await response.text()
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    })
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 })
  }
}
