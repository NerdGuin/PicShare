import { getUser } from './auth';

export async function getGallery(sort = 'recent', limit = 999) {
  const url = new URL(import.meta.env.VITE_SERVER_URL + '/gallery');
  url.searchParams.append('sort', sort);
  url.searchParams.append('limit', limit.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error('Error when searching gallery');
  }

  const data = await res.json();
  return data.gallery;
}

export async function deleteGalleryImage(id: string) {
  const currentUser = getUser();

  if (!currentUser) {
    throw new Error('User not logged in');
  }

  const url = new URL(import.meta.env.VITE_SERVER_URL + `/gallery/${id}`);

  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: currentUser.id }),
  });

  if (!res.ok) {
    throw new Error('Failed to delete image');
  }

  return await res.json();
}

export function uploadImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async () => {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Invalid file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(
        import.meta.env.VITE_SERVER_URL + '/gallery/upload',
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        window.location.reload();
      } else {
        alert('An error was encountered while sending the image');
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  input.click();
}
