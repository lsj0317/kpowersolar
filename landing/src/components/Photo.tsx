interface PhotoProps {
  /** 기본 이미지 경로 (없으면 자리표시 박스 렌더링) */
  src?: string;
  /** "a-768.webp 768w, a-1280.webp 1280w, a-1920.webp 1920w" */
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  /** 첫 화면 이미지: eager + fetchpriority high */
  priority?: boolean;
  /** 자리표시 박스에 보이는 안내 문구 */
  placeholderLabel?: string;
}

/**
 * 가이드 2-1: 실제 사진이 디자인의 80%.
 * 사진이 준비되기 전에는 교체 위치가 보이는 자리표시를 렌더링합니다.
 */
export function Photo({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  priority = false,
  placeholderLabel,
}: PhotoProps) {
  if (!src) {
    return (
      <div className={`photo photo--placeholder ${className}`} role="img" aria-label={alt}>
        <span className="photo__hint" aria-hidden="true">
          {placeholderLabel ?? '사진 교체 예정'}
        </span>
      </div>
    );
  }

  return (
    <img
      className={`photo ${className}`}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 은 camelCase prop 을 인식하지 못하므로 소문자 속성으로 전달
      {...(priority ? { fetchpriority: 'high' } : {})}
    />
  );
}
