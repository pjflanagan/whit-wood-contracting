import Link from "next/link";

import Style from "./style.module.scss";

export function SocialIconRow() {
  return (
    <div className={Style["social-icon-row"]}>
      <Link
        target="_blank"
        title="Spotify"
        href="https://open.spotify.com/artist/64mWZmWHfA6SoxqoibbwbR?si=WggJ-PvlTq-3A-EVLXcg8Q"
      >
        <img width="24" alt="Spotify" src="/img/icon/icons8-spotify-48.png" />
      </Link>
      <Link
        target="_blank"
        title="Youtube"
        href="https://www.youtube.com/@julianwittich5893"
      >
        <img width="24" alt="Youtube" src="/img/icon/icons8-youtube-48.png" />
      </Link>
      <Link
        target="_blank"
        title="Instagram"
        href="https://www.instagram.com/julianwittich?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
      >
        <img
          width="24"
          alt="Instagram"
          src="/img/icon/icons8-instagram-48.png"
        />
      </Link>
    </div>
  );
}
