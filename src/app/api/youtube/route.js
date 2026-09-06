import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Vui lòng cung cấp link YouTube' }, { status: 400 });
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: 'Đường dẫn YouTube không hợp lệ' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    
    // Chọn thumbnail độ phân giải cao nhất
    const thumbnails = info.videoDetails.thumbnails;
    const cover = thumbnails.length > 0 ? thumbnails[thumbnails.length - 1].url : '';

    // Lọc các định dạng có sẵn
    const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    // Lấy link video tốt nhất (kết hợp cả tiếng và hình)
    let videoUrl = '';
    if (videoFormats.length > 0) {
      videoFormats.sort((a, b) => (b.height || 0) - (a.height || 0));
      videoUrl = videoFormats[0].url;
    } else {
      const videoOnly = ytdl.filterFormats(info.formats, 'videoonly');
      if (videoOnly.length > 0) videoUrl = videoOnly[0].url;
    }

    // Lấy link âm thanh (MP3) tốt nhất
    let audioUrl = '';
    if (audioFormats.length > 0) {
      audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));
      audioUrl = audioFormats[0].url;
    }

    return NextResponse.json({
      title: title || 'YouTube Video',
      cover: cover,
      videoUrl: videoUrl,
      audioUrl: audioUrl
    });

  } catch (error) {
    console.error('Lỗi khi tải video YouTube:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi hệ thống hoặc video bị giới hạn.' },
      { status: 500 }
    );
  }
}
