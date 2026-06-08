import { useEffect, useState } from 'react';
import { initTranslator } from '../../assets/translator/Translator.tsx';
import '../../assets/auth/auth.tsx';
import { deleteGalleryImage, getGallery } from '../../assets/auth/gallery.tsx';

// COMPONENTS
import Header from '../../components/header/index.tsx';
import Footer from '../../components/footer/index.tsx';
import Hero from '../../components/hero/index.tsx';
import Features from '../../components/features/index.tsx';
import Gallery from '../../components/gallery/index.tsx';

function Home() {
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Hero />
      <Features />
      <Gallery items={loadedGallery} onRemove={handleRemove} />
      <Footer />
    </div>
  );
}

export default Home;
