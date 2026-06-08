import './index.css';
import { useEffect, useState } from 'react';
import { initTranslator } from '../../assets/translator/Translator.tsx';
import '../../assets/auth/auth.tsx';
import { deleteGalleryImage, getGallery } from '../../assets/auth/gallery.tsx';

// COMPONENTS
import Header from '../../components/header/index.tsx';
import Footer from '../../components/footer/index.tsx';
import GalleryComponent from '../../components/gallery/index.tsx';

function Gallery() {
  const [, setGallery] = useState<any[]>([]);
  const [loadedGallery, setLoadedGallery] = useState<any[]>([]);

  const handleRemove = async (id: string) => {
    try {
      await deleteGalleryImage(id);
      setLoadedGallery((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initTranslator('en');

    getGallery()
      .then((data) => {
        setGallery(data);

        (async () => {
          for (let i = 0; i < data.length; i++) {
            setLoadedGallery((prev) => {
              if (!prev.find((x) => x._id === data[i]._id)) {
                return [...prev, data[i]];
              }
              return prev;
            });
            await new Promise((r) => setTimeout(r, 1));
          }
        })();
      })
      .catch(console.error);
  }, []);

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Header />

      <div className="filter-section">
        <div className="filter-bar">
          <div className="filter-btn active">All</div>
          <div className="filter-btn">Photos</div>
          <div className="filter-btn">Art</div>
          <div className="filter-btn">Design</div>
          <div className="filter-btn">Graphics</div>
          <div className="filter-btn">Wallpaper</div>
        </div>
      </div>

      <GalleryComponent items={loadedGallery} onRemove={handleRemove} />

      <Footer />
    </div>
  );
}

export default Gallery;
