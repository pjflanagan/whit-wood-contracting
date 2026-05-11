import { useState } from 'react';
import Image from 'next/image';
import Style from './Modal.module.scss';

type ModalProps = {
  title: string;
  description: string;
  images?: string[];
  onClose: () => void;
};

export function Modal({ title, description, images = [], onClose }: ModalProps) {
  const [slide, setSlide] = useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div className={Style.modalOverlay} onClick={onClose}>
      <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
        <button className={Style.modalClose} onClick={onClose}>✕</button>
        {images.length > 0 && (
          <div className={Style.slideshow}>
            <Image
              src={images[slide]!}
              alt={title}
              className={Style.slide}
              fill
              unoptimized
            />
            {hasMultiple && (
              <>
                <button
                  className={`${Style.slideBtn} ${Style.slidePrev}`}
                  onClick={() => setSlide((s) => (s - 1 + images.length) % images.length)}
                >
                  ‹
                </button>
                <button
                  className={`${Style.slideBtn} ${Style.slideNext}`}
                  onClick={() => setSlide((s) => (s + 1) % images.length)}
                >
                  ›
                </button>
                <div className={Style.slideDots}>
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`${Style.dot} ${i === slide ? Style.dotActive : ''}`}
                      onClick={() => setSlide(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className={Style.modalBody}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
