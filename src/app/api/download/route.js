import { NextResponse } from 'next/server';
import { douyin } from 'btch-downloader';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp URL.' },
        { status: 400 }
      );
    }

    // Lọc URL ra khỏi đoạn văn bản thừa (ví dụ: người dùng paste toàn bộ text copy từ app)
    const urlMatch = url.match(/(https?:\/\/[^\s]+)/);
    const extractedUrl = urlMatch ? urlMatch[0] : url;

    const result = await douyin(extractedUrl);
    
    if (!result || !result.status || !result.result || !result.result.data) {
      return NextResponse.json(
        { error: 'Không thể lấy thông tin video. Liên kết có thể không hợp lệ hoặc riêng tư.' },
        { status: 404 }
      );
    }

    const data = result.result.data;
    
    // Extract video url, typically from the first link in the 'links' array
    let videoUrl = '';
    let audioUrl = '';
    if (data.links && data.links.length > 0) {
      videoUrl = data.links[0].url; // Default to first link
      // Try to find specific formats by decoding the JWT token in the URL
      for (const link of data.links) {
        try {
          let isMp3 = false;
          let isMp4 = false;
          
          if (link.url.includes('token=')) {
            const token = link.url.split('token=')[1];
            const payload = Buffer.from(token.split('.')[1], 'base64').toString('utf-8');
            if (payload.includes('.mp3')) isMp3 = true;
            if (payload.includes('.mp4')) isMp4 = true;
          } else {
            if (link.url.includes('.mp3')) isMp3 = true;
            if (link.url.includes('.mp4')) isMp4 = true;
          }
          
          if (isMp4 && !videoUrl.includes('.mp4')) videoUrl = link.url;
          if (isMp3) audioUrl = link.url;
        } catch (e) {
          // Ignore decoding errors
        }
      }
    }
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Không tìm thấy link video trong kết quả trả về.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      title: data.title || 'Douyin Video',
      cover: data.thumbnail || '',
      videoUrl: videoUrl,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error('Lỗi khi lấy video:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống hoặc thư viện trích xuất không phản hồi.' },
      { status: 500 }
    );
  }
}
