export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  let title = searchParams.get('title') || 'Douyin_Video';
  const ext = searchParams.get('ext') || 'mp4';

  if (!url) {
    return new Response('Thiếu tham số url', { status: 400 });
  }

  try {
    // Xóa các ký tự không hợp lệ cho tên file trên hệ điều hành
    const safeTitle = title.replace(/[<>:"/\\|?*]+/g, '').trim();
    const filename = `${safeTitle}.${ext}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Chuyển tiếp stream về cho trình duyệt
    const headers = new Headers(response.headers);
    
    // Ghi đè header Content-Disposition để ép tải xuống với tên mới
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    
    // Xóa header content-encoding để tránh lỗi giải nén
    headers.delete('content-encoding');

    return new Response(response.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Proxy download error:', error);
    return new Response('Có lỗi xảy ra khi tải file', { status: 500 });
  }
}
