import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: '이메일과 코드가 필요합니다.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: `"틈새시간" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '틈새시간 인증번호입니다',
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6">
    <h2 style="color: #319795;">틈새시간 인증번호입니다</h2>
    <p>아래 인증번호를 입력해주세요:</p>
    <h3 style="color: #2D3748;">${code}</h3>
    <hr/>
    <small>본 메일은 자동 발송되었습니다. 답장하지 마세요.</small>
  </div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('메일 전송 오류:', error);
    return NextResponse.json({ error: '메일 전송 실패' }, { status: 500 });
  }
}
