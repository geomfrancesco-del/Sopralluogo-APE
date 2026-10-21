import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, Maximize2, X } from 'lucide-react';

interface ApplePencilSignaturePadProps {
  signatureUrl?: string;
  onSaveSignature: (dataUrl: string) => void;
  onClearSignature: () => void;
  clientName?: string;
}

export const ApplePencilSignaturePad: React.FC<ApplePencilSignaturePadProps> = ({
  signatureUrl,
  onSaveSignature,
  onClearSignature,
  clientName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHasDrawn, setModalHasDrawn] = useState(false);

  // Initialize and scale inline canvas for high-DPI (Retina / Apple iPad)
  const initCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a'; // Deep navy/black ink
    }
  };

  useEffect(() => {
    if (!signatureUrl && canvasRef.current) {
      initCanvas(canvasRef.current);
    }
  }, [signatureUrl]);

  useEffect(() => {
    if (isModalOpen && modalCanvasRef.current) {
      // Short delay to ensure modal DOM is mounted
      const timer = setTimeout(() => {
        initCanvas(modalCanvasRef.current);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Handle pointer down (Apple Pencil or finger or mouse)
  const handlePointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null
  ) => {
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  // Handle pointer move
  const handlePointerMove = (
    e: React.PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement | null,
    setDrawnState: (drawn: boolean) => void
  ) => {
    if (!isDrawing || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Optional subtle pressure sensitivity if Apple Pencil provides pressure
    if (e.pointerType === 'pen' && e.pressure > 0) {
      ctx.lineWidth = Math.max(1.8, Math.min(4.5, e.pressure * 5));
    } else {
      ctx.lineWidth = 2.5;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setDrawnState(true);
  };

  // Handle pointer up
  const handlePointerUp = (
    canvas: HTMLCanvasElement | null,
    autoSave = false
  ) => {
    setIsDrawing(false);
    if (canvas && autoSave) {
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
    }
  };

  const handleClearInline = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
    onClearSignature();
  };

  const handleClearModal = () => {
    const canvas = modalCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setModalHasDrawn(false);
  };

  const handleSaveModal = () => {
    const canvas = modalCanvasRef.current;
    if (canvas && modalHasDrawn) {
      const dataUrl = canvas.toDataURL('image/png');
      onSaveSignature(dataUrl);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative">
      {signatureUrl ? (
        // Already signed state: display signature image
        <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 rounded border border-slate-200">
          <div className="h-16 flex items-center justify-center max-w-full">
            <img
              src={signatureUrl}
              alt="Firma del Committente"
              className="max-h-16 max-w-full object-contain"
            />
          </div>
          <span className="text-[11px] font-bold text-slate-800 mt-1">
            {clientName || 'Il Committente'}
          </span>
          <span className="text-[9px] text-slate-400 italic">
            Firma autografa apposta con Apple Pencil
          </span>

          <div className="no-print mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearInline}
              className="px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Rifirma / Cancella</span>
            </button>
          </div>
        </div>
      ) : (
        // Canvas ready for Apple Pencil signing
        <div className="bg-slate-50/80 rounded border-2 border-dashed border-indigo-200 p-2 text-center transition-all">
          <div className="relative w-full h-24 bg-white rounded border border-slate-200 overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => handlePointerDown(e, canvasRef.current)}
              onPointerMove={(e) => handlePointerMove(e, canvasRef.current, setHasDrawn)}
              onPointerUp={() => handlePointerUp(canvasRef.current, true)}
              onPointerCancel={() => handlePointerUp(canvasRef.current, true)}
            />

            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                <PenTool className="w-4 h-4 mb-1 text-indigo-400" />
                <span className="text-[11px] font-medium text-slate-500">
                  Firma qui con Apple Pencil o tocco
                </span>
                <span className="text-[9px] text-slate-400">
                  {clientName ? `Sig. ${clientName}` : 'Committente'}
                </span>
              </div>
            )}
          </div>

          <div className="no-print mt-2 flex items-center justify-between gap-2 px-1 text-[10px]">
            <button
              type="button"
              onClick={handleClearInline}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Pulisci</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Firma a Schermo Intero</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal di firma grande per iPad */}
      {isModalOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold">
                <PenTool className="w-5 h-5 text-indigo-600" />
                <span>Firma con Apple Pencil - Committente</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Traccia la firma del Committente (<strong>{clientName || 'Proprietario'}</strong>) nell&apos;area sottostante usando l&apos;Apple Pencil o il tocco:
            </p>

            <div className="relative w-full h-64 bg-slate-50 rounded-xl border-2 border-dashed border-indigo-300 overflow-hidden cursor-crosshair">
              <canvas
                ref={modalCanvasRef}
                className="w-full h-full block"
                style={{ touchAction: 'none' }}
                onPointerDown={(e) => handlePointerDown(e, modalCanvasRef.current)}
                onPointerMove={(e) => handlePointerMove(e, modalCanvasRef.current, setModalHasDrawn)}
                onPointerUp={() => handlePointerUp(modalCanvasRef.current, false)}
                onPointerCancel={() => handlePointerUp(modalCanvasRef.current, false)}
              />

              {!modalHasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-sm">
                  <PenTool className="w-6 h-6 mb-2 text-indigo-400" />
                  <span className="font-semibold text-slate-600">
                    Firma qui con Apple Pencil
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5">
                    Tratto fluido ad alta precisione
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClearModal}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Pulisci Tratto</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={!modalHasDrawn}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Conferma e Salva Firma</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
