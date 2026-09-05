"use client";

import { useState } from "react";
import styles from "./page.module.css";
import toast from "react-hot-toast";
import { Download, Search, Play, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error("Vui lòng nhập link Douyin!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/download", {
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
      // Due to CORS on Douyin CDN, fetching blob directly might fail in some browsers.
      // We'll try fetch first, if it fails, we fallback to opening in new tab.
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("CORS or Fetch error");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Douyin_${title ? title.substring(0, 20) : 'file'}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Bắt đầu tải xuống!", { id: toastId });
    } catch (error) {
      toast.error("Bắt đầu tải trong thẻ mới (Do giới hạn của trình duyệt)", { id: toastId });
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Douyin Downloader Logo" style={{ width: 80, height: 80, borderRadius: '20px', marginBottom: '1.5rem', objectFit: 'cover', boxShadow: '0 8px 32px rgba(255, 0, 80, 0.3)' }} />
        <h1 className={styles.title}>Douyin Downloader</h1>
        <p className={styles.subtitle}>Tải video TikTok Trung Quốc không có logo chất lượng cao</p>
      </div>

      <form className={styles.searchBox} onSubmit={handleDownload}>
        <input
          type="text"
          className={styles.input}
          placeholder="Dán liên kết chia sẻ Douyin vào đây..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? (
            <Loader2 className={styles.spinner} size={20} />
          ) : (
            <Search size={20} />
          )}
          Tìm kiếm
        </button>
      </form>

      {result && (
        <div className={styles.resultCard}>
          <div className={styles.videoInfo}>
            <div className={styles.thumbnailContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={result.cover || '/next.svg'} 
                alt="Video Cover" 
                className={styles.thumbnail} 
              />
            </div>
            <div className={styles.details}>
              <h2 className={styles.videoTitle}>{result.title || "Video không có tiêu đề"}</h2>
              
              <div className={styles.actionButtons}>
                <button 
                  className={`${styles.actionButton} ${styles.primary}`}
                  onClick={() => handleDirectDownload(result.videoUrl, result.title, 'mp4')}
                >
                  <Download size={20} />
                  Tải Video (.mp4)
                </button>
                {result.audioUrl && (
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleDirectDownload(result.audioUrl, result.title, 'mp3')}
                  >
                    <Download size={20} />
                    Tải Nhạc (.mp3)
                  </button>
                )}
                <a 
                  href={result.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.actionButton}
                >
                  <Play size={20} />
                  Mở video
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
