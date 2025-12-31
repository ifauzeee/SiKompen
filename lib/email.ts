interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('[Email] Konfigurasi email tidak tersedia. Email tidak dikirim.');
        console.log('[Email] To:', options.to);
        console.log('[Email] Subject:', options.subject);
        return false;
    }

    try {
        const nodemailer = await import('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        console.log('[Email] Berhasil dikirim ke:', options.to);
        return true;
    } catch (error) {
        console.error('[Email] Gagal mengirim email:', error);
        return false;
    }
}

export function getApprovalEmailTemplate(data: {
    studentName: string;
    jobTitle: string;
    hours: number;
    newTotalHours: number;
}): { subject: string; html: string } {
    return {
        subject: `✅ Lamaran Anda Disetujui - ${data.jobTitle}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #00A79D, #008B82); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 30px; }
                    .success-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
                    .info-box { background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; margin: 20px 0; }
                    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                    .info-row:last-child { border-bottom: none; }
                    .label { color: #6b7280; }
                    .value { font-weight: bold; color: #111827; }
                    .hours-reduced { background: #22c55e; color: white; padding: 15px; border-radius: 12px; text-align: center; margin: 20px 0; }
                    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SiKompen - PNJ</h1>
                    </div>
                    <div class="content">
                        <div class="success-icon">✅</div>
                        <h2 style="text-align: center; color: #22c55e; margin-bottom: 10px;">Selamat!</h2>
                        <p style="text-align: center; color: #6b7280;">Lamaran pekerjaan Anda telah disetujui.</p>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <span class="label">Nama</span>
                                <span class="value">${data.studentName}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Pekerjaan</span>
                                <span class="value">${data.jobTitle}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Kompensasi</span>
                                <span class="value">${data.hours} Jam</span>
                            </div>
                        </div>
                        
                        <div class="hours-reduced">
                            <p style="margin: 0; font-size: 14px;">Jam hutang Anda berkurang ${data.hours} jam</p>
                            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold;">Sisa: ${data.newTotalHours} Jam</p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; text-align: center;">
                            Silakan selesaikan pekerjaan sesuai dengan ketentuan yang berlaku.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Email ini dikirim otomatis oleh sistem SiKompen.</p>
                        <p>© ${new Date().getFullYear()} Politeknik Negeri Jakarta</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

export function getRejectionEmailTemplate(data: {
    studentName: string;
    jobTitle: string;
}): { subject: string; html: string } {
    return {
        subject: `❌ Lamaran Ditolak - ${data.jobTitle}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #00A79D, #008B82); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 30px; }
                    .reject-icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
                    .info-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0; }
                    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>SiKompen - PNJ</h1>
                    </div>
                    <div class="content">
                        <div class="reject-icon">❌</div>
                        <h2 style="text-align: center; color: #ef4444; margin-bottom: 10px;">Mohon Maaf</h2>
                        <p style="text-align: center; color: #6b7280;">Lamaran pekerjaan Anda tidak dapat disetujui.</p>
                        
                        <div class="info-box">
                            <p style="margin: 0;"><strong>Pekerjaan:</strong> ${data.jobTitle}</p>
                        </div>
                        
                        <p style="color: #6b7280; font-size: 14px; text-align: center;">
                            Jangan berkecil hati! Silakan coba lamar pekerjaan lain yang tersedia di sistem SiKompen.
                        </p>
                    </div>
                    <div class="footer">
                        <p>Email ini dikirim otomatis oleh sistem SiKompen.</p>
                        <p>© ${new Date().getFullYear()} Politeknik Negeri Jakarta</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}
