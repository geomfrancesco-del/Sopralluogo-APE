import React, { useState, useRef } from 'react';
import { ApeInspection, InspectionPhoto, PHOTO_CATEGORIES, PhotoCategory } from '../../types/ape';
import { Camera, Upload, Trash2, Eye, CheckCircle2, AlertTriangle, X, AlertCircle } from 'lucide-react';

interface PhotosTabProps {
  inspection: ApeInspection;
  onChange: (updated: ApeInspection) => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({ inspection, onChange }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<InspectionPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<InspectionPhoto | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = inspection.photos || [];

  // Check mandatory APE categories covered
  const coveredCategories = new Set(photos.map((p) => p.category));
  const missingCategories = PHOTO_CATEGORIES.filter(
    (c) => c.requiredForApe && !coveredCategories.has(c.id)
  );

  const handleImageFile = (file: File, category: PhotoCategory) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      // Compress image on client via canvas to ensure localStorage doesn't overflow
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

          const categoryDef = PHOTO_CATEGORIES.find((c) => c.id === category);
          const newPhoto: InspectionPhoto = {
            id: `photo-${Date.now()}`,
            category,
            categoryLabel: categoryDef ? categoryDef.label : 'Rilievo Fotografico',
            imageUrl: compressedDataUrl,
            caption: `${categoryDef?.label || 'Foto rilievo'} - ${new Date().toLocaleDateString('it-IT')}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };

          onChange({
            ...inspection,
            photos: [newPhoto, ...photos],
            updatedAt: new Date().toISOString(),
          });
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, category: PhotoCategory) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0], category);
      e.target.value = '';
    }
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    onChange({
      ...inspection,
      photos: photos.map((p) => (p.id === id ? { ...p, caption } : p)),
      updatedAt: new Date().toISOString(),
    });
  };

  const updatePhotoCategory = (id: string, category: PhotoCategory) => {
    const categoryDef = PHOTO_CATEGORIES.find((c) => c.id === category);
    onChange({
      ...inspection,
      photos: photos.map((p) =>
        p.id === id
          ? { ...p, category, categoryLabel: categoryDef?.label || 'Altro' }
          : p
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const confirmDeletePhoto = () => {
    if (!photoToDelete) return;
    const targetId = photoToDelete.id;
    onChange({
      ...inspection,
      photos: photos.filter((p) => p.id !== targetId),
      updatedAt: new Date().toISOString(),
    });
    if (selectedPhoto?.id === targetId) {
      setSelectedPhoto(null);
    }
    setPhotoToDelete(null);
  };

  const filteredPhotos =
    activeCategoryFilter === 'all'
      ? photos
      : photos.filter((p) => p.category === activeCategoryFilter);

  return (
    <div className="space-y-6">
      {/* Indicatore di Completezza Fascicolo Fotografico APE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Fascicolo Fotografico Obbligatorio APE</span>
              <span className="text-xs font-mono font-normal text-slate-500">
                ({photos.length} foto acquisite)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Linee Guida Nazionali: il certificatore deve documentare con rilievo fotografico generatore, libretto, infissi e involucro.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {missingCategories.length === 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tutte le categorie obbligatorie presenti</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Mancano {missingCategories.length} foto raccomandate</span>
              </div>
            )}
          </div>
        </div>

        {/* Guida categorie rapide con pulsanti dedicati per iPad */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHOTO_CATEGORIES.map((cat) => {
            const isCovered = coveredCategories.has(cat.id);
            const count = photos.filter((p) => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCovered
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-amber-50/30 border-dashed border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                      {cat.label}
                      {cat.requiredForApe && (
                        <span className="text-[10px] text-indigo-700 font-bold" title="Obbligatorio per APE">*</span>
                      )}
                    </span>
                    <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                      {cat.hint}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
                    {count}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <label className="flex-1 min-h-[40px] px-2 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-700 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Scatta</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileInputChange(e, cat.id)}
                    />
                  </label>

                  <label className="flex-1 min-h-[40px] px-2 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-md text-slate-700 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Carica</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileInputChange(e, cat.id)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra di Filtraggio Categorie */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`min-h-[36px] px-3 py-1.5 rounded-md transition-colors ${
              activeCategoryFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Tutte ({photos.length})
          </button>
          {PHOTO_CATEGORIES.map((c) => {
            const count = photos.filter((p) => p.category === c.id).length;
            if (count === 0 && photos.length > 0) return null;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategoryFilter(c.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  activeCategoryFilter === c.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                {c.label.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Griglia Fotografica */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Camera className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Nessuna fotografia in questa vista</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Usa i pulsanti in alto per scattare foto direttamente con la fotocamera dell'iPad o caricare immagini dal rullino.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Image Preview Container with Click to Zoom */}
              <div
                onClick={() => setSelectedPhoto(photo)}
                className="relative aspect-4/3 bg-slate-900 cursor-pointer overflow-hidden"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-black/75 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5" />
                    Ingrandisci dettaglio
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 drop-shadow-md">
                  <span className="px-2 py-0.5 bg-black/60 rounded font-medium backdrop-blur-xs">
                    {photo.categoryLabel}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {photo.timestamp}
                  </span>
                </div>
              </div>

              {/* Didascalia e Gestione Categoria */}
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                <textarea
                  rows={2}
                  value={photo.caption}
                  onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                  placeholder="Inserisci didascalia descrittiva..."
                  className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none transition-colors"
                />

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <select
                    value={photo.category}
                    onChange={(e) => updatePhotoCategory(photo.id, e.target.value as PhotoCategory)}
                    className="h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                  >
                    {PHOTO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoToDelete(photo);
                    }}
                    title="Elimina foto"
                    className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ingrandimento Foto (ad es. per leggere targhetta caldaia o numeri matricola) */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4 flex flex-col items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            <div className="p-4 bg-slate-950 flex items-center justify-between text-white border-b border-slate-800">
              <span className="text-sm font-semibold">{selectedPhoto.categoryLabel}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoToDelete(selectedPhoto)}
                  title="Elimina fotografia"
                  className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-600/60 rounded-lg flex items-center gap-1.5 transition-colors border border-rose-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Elimina foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 flex items-center justify-between">
              <span>{selectedPhoto.caption}</span>
              <span className="font-mono text-slate-500">{selectedPhoto.timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {/* Dialogo di Conferma Eliminazione Foto (Senza window.confirm) */}
      {photoToDelete && (
        <div
          onClick={() => setPhotoToDelete(null)}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Eliminare fotografia?</h4>
                <p className="text-xs text-slate-500">{photoToDelete.categoryLabel}</p>
              </div>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-200">
              <img
                src={photoToDelete.imageUrl}
                alt={photoToDelete.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              La fotografia verrà rimossa dal fascicolo del sopralluogo APE e non comparirà nella scheda tecnica finale.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Elimina Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
