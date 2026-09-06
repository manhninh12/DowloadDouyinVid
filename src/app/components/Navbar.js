'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  
  // Kiểm tra route hiện tại để làm nổi bật (active) tab tương ứng
  const isDouyin = pathname === '/' || pathname === '/douyin';
  const isYoutube = pathname === '/youtube';

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Logo" className={styles.logo} width={40} height={40} />
        <h1 className={styles.brandName}>Downloader</h1>
      </Link>
      
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={`${styles.navLink} ${isDouyin ? styles.activeDouyin : ''}`}
        >
          Douyin Download
        </Link>
        <Link 
          href="/youtube" 
          className={`${styles.navLink} ${isYoutube ? styles.activeYoutube : ''}`}
        >
          YouTube Download
        </Link>
      </div>
    </nav>
  );
}
