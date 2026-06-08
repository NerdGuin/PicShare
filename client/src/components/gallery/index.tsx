import './index.css';
import { getUser } from '../../assets/auth/auth.tsx';

interface GalleryItem {
  _id: string;
  image: string;
  category?: string;
  userId: string;
}

interface GalleryProps {
  items: GalleryItem[];
  onRemove: (id: string) => void;
}

function Gallery({ items, onRemove }: GalleryProps) {
  const currentUserId = getUser()?.id;

  return (
    <section className="gallery">
      <div className="section-header">
        <h2 className="section-title" data-i18n="gallery_title">
          Popular Images
        </h2>
        <p className="section-desc" data-i18n="gallery_subtitle">
          Curated selection of the most downloaded visuals this week.
        </p>
      </div>
      <div className="gallery-grid">
        {items.slice(0, 50).map((item, index) => {
          const categoryClassMap: Record<string, string> = {
            wallpaper: 'ratio-wallpaper',
            standard: 'ratio-standard',
          };

          const ratioClass =
            categoryClassMap[item.category?.toLowerCase() || ''] ||
            'ratio-standard';

          return (
            <div
              key={String(item._id) || index}
              className={`gallery-item item-${index + 1} ${ratioClass}`}
            >
              <div className="category-tag">{item.category || 'Photos'}</div>
              <img src={item.image} className="gallery-img" />

              <div className="gallery-overlay">
                <div className="gallery-actions">
                  <button className="action-btn">
                    <i className="ri-heart-line"></i>
                  </button>
                  <button className="action-btn">
                    <i className="ri-download-line"></i>
                  </button>

                  {item.userId === currentUserId && (
                    <button
                      className="action-btn"
                      onClick={() => onRemove(item._id)}
                    >
                      <i
                        className="ri-delete-bin-line"
                        style={{ color: 'red' }}
                      ></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Gallery;
