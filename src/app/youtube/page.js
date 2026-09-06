'use client';

import { useState } from "react";
import douyinStyles from "../page.module.css";
import ytStyles from "./youtube.module.css";
import toast from "react-hot-toast";
import { Download, Search, Play, Loader2 } from "lucide-react";

export default function YoutubePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error("Vui lòng nhập link YouTube!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi tải dữ liệu");
      }

      setResult(data);
      toast.success("Lấy thông tin video thành công!");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDownload = async (downloadUrl, title, ext = 'mp4') => {
    const toastId = toast.loading("Đang chuẩn bị file tải xuống...");
    try {
      // Dùng proxy API để đổi tên file tải xuống
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(downloadUrl)}&title=${encodeURIComponent(title || 'YouTube_Video')}&ext=${ext}`;

      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Bắt đầu tải xuống!", { id: toastId });
    } catch (error) {
      toast.error("Bắt đầu tải trong thẻ mới", { id: toastId });
      window.open(downloadUrl, '_blank');
    }
  };

  const containerClass = `${douyinStyles.container} ${ytStyles.youtubeContainer}`;

  return (
    <main className={containerClass}>
      <div className={douyinStyles.hero}>
        <h1 className={`${douyinStyles.title} ${ytStyles.title}`}>YouTube Downloader</h1>
        <p className={douyinStyles.subtitle}>antromancuop chất lượng cao</p>
      </div>

      <form className={`${douyinStyles.searchBox} ${ytStyles.searchBox}`} onSubmit={handleDownload}>
        <input
          type="text"
          className={douyinStyles.input}
          placeholder="Dán liên kết video YouTube vào đây..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className={`${douyinStyles.button} ${ytStyles.button}`} disabled={loading}>
          {loading ? (
            <Loader2 className={douyinStyles.spinner} size={20} />
          ) : (
            <Search size={20} />
          )}
          Tìm kiếm
        </button>
      </form>

      {result && (
        <div className={douyinStyles.resultCard}>
          <div className={douyinStyles.videoInfo}>
            <div className={`${douyinStyles.thumbnailContainer} ${ytStyles.thumbnailContainer}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.cover || '/next.svg'}
                alt="Video Cover"
                className={douyinStyles.thumbnail}
              />
            </div>
            <div className={douyinStyles.details}>
              <h2 className={douyinStyles.videoTitle}>{result.title || "Video không có tiêu đề"}</h2>

              <div className={douyinStyles.actionButtons}>
                {result.videoUrl && (
                  <button
                    className={`${douyinStyles.actionButton} ${douyinStyles.primary}`}
                    onClick={() => handleDirectDownload(result.videoUrl, result.title, 'mp4')}
                  >
                    <Download size={20} />
                    Tải Video (.mp4)
                  </button>
                )}
                {result.audioUrl && (
                  <button
                    className={douyinStyles.actionButton}
                    onClick={() => handleDirectDownload(result.audioUrl, result.title, 'mp3')}
                  >
                    <Download size={20} />
                    Tải Nhạc (.mp3)
                  </button>
                )}
                <a
                  href={result.videoUrl || result.audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={douyinStyles.actionButton}
                >
                  <Play size={20} />
                  Mở trực tiếp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
