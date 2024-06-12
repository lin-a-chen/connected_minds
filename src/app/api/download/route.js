import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { NextResponse } from 'next/server';

const getFileFromUrl = (url) => {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop();
};

export const GET = async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");
        
        if (!url) {
            return NextResponse.json({ success: false, data: 'URL parameter is missing' }, { status: 400 });
        }

        const fileName = getFileFromUrl(url);
        const filePath = path.join(process.cwd(), fileName);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ success: false, data: 'File not found' }, { status: 404 });
        }

        const fileStream = fs.createReadStream(filePath);
        
        const headers = new Headers();
        headers.append('Content-Disposition', `attachment; filename="${fileName}"`);
        headers.append('Content-Type', 'application/octet-stream');

        const response = new NextResponse(fileStream, { headers });
        return response;

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, data: 'Server error' }, { status: 500 });
    }
};
