import React, { FormEvent, useEffect, useState } from 'react';
import * as C from './App.styles';
import * as Photos from './Services/photos';
import { Photo } from './Types/photo';
import { PhotoItem } from './Components/PhotoItem';

const App = () => {

  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    }
    getPhotos();
  }, []);


  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;
    
    if (file && file.size > 0) {
      setUploading(true);
        // Faz o upload do arquivo
        let result = await Photos.insert(file);

      setUploading(false);

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
       
    }
  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        {/* Área de upload */}
        <C.UploadForm 
          method="POST"
          onSubmit={handleFormSubmit}
        >
          <input type="file" name="image" />
          <input type="submit" value="enviar" />
          {uploading && "Enviando..."}

        </C.UploadForm>


        {/* Lista de Fotos */}
        {loading &&
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <C.PhotoList>
            {photos.map((item, index)=>(
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotoList>
        }

        {!loading && photos.length === 0 &&
          <C.ScreenWarning>
            <div className="emoji">📷</div>
            <div>Não há fotos cadastradas.</div>
          </C.ScreenWarning>
        }

      </C.Area>
    </C.Container>
  );
}

export default App;
