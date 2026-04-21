import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Loader2, Upload, RotateCcw } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onResult: (r: { category: string; weightKg: number }) => void;
}

interface Detection {
  rawLabel: string;
  category: string;
  weightKg: number;
  confidence: number;
}

const mapToCategory = (label: string): { category: string; weightKg: number } => {
  const l = label.toLowerCase();
  if (/(bottle|plastic|container)/.test(l)) return { category: 'Plastic', weightKg: 0.5 };
  if (/(computer|laptop|keyboard|phone|cellular|screen|monitor|television)/.test(l)) return { category: 'E-Waste', weightKg: 1.2 };
  if (/(paper|book|cardboard|newspaper|envelope|carton)/.test(l)) return { category: 'Paper', weightKg: 0.8 };
  if (/(can|metal|aluminum|tin)/.test(l)) return { category: 'Metal', weightKg: 0.6 };
  return { category: 'Mixed Waste', weightKg: 1.0 };
};

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

export const ARScanner = ({ open, onClose, onResult }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permState, setPermState] = useState<'asking' | 'ok' | 'denied' | 'desktop'>('asking');
  const [analyzing, setAnalyzing] = useState(false);
  const [detection, setDetection] = useState<Detection | null>(null);
  const [modelLoading, setModelLoading] = useState(false);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    if (!open) return;
    if (!isMobile()) {
      setPermState('desktop');
      return;
    }
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setPermState('ok');
      } catch {
        setPermState('denied');
      }
    })();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [open]);

  const ensureModel = async () => {
    if (modelRef.current) return modelRef.current;
    setModelLoading(true);
    const tf = await import('@tensorflow/tfjs');
    await tf.ready();
    const mobilenet = await import('@tensorflow-models/mobilenet');
    const model = await mobilenet.load({ version: 2, alpha: 0.5 });
    modelRef.current = model;
    setModelLoading(false);
    return model;
  };

  const classifyFrom = async (source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) => {
    setAnalyzing(true);
    setDetection(null);
    try {
      const model = await ensureModel();
      const preds = await model.classify(source);
      const top = preds[0];
      const mapped = mapToCategory(top.className);
      setDetection({ rawLabel: top.className.split(',')[0], category: mapped.category, weightKg: mapped.weightKg, confidence: Math.round(top.probability * 100) });
    } catch (e) {
      setDetection({ rawLabel: 'Unknown item', category: 'Mixed Waste', weightKg: 1.0, confidence: 0 });
    } finally {
      setAnalyzing(false);
    }
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    await classifyFrom(c);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => classifyFrom(img);
    img.src = URL.createObjectURL(file);
  };

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 z-[300] bg-black flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2"><Camera className="w-5 h-5" /><p className="font-bold">AR Waste Scanner</p></div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {permState === 'asking' && <div className="text-white">Requesting camera…</div>}

        {permState === 'denied' && (
          <div className="text-center text-white px-6 max-w-sm">
            <p className="text-lg font-bold">Camera access denied</p>
            <p className="text-sm text-white/70 mt-2">Please allow camera permission in browser settings, or upload an image instead.</p>
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-eco font-bold cursor-pointer">
              <Upload className="w-4 h-4" /> Upload Image
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
          </div>
        )}

        {permState === 'desktop' && (
          <div className="text-center text-white px-6 max-w-sm">
            <p className="text-lg font-bold">📱 AR Scanner works best on mobile</p>
            <p className="text-sm text-white/70 mt-2">On desktop, upload an image and we'll classify it for you.</p>
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-eco font-bold cursor-pointer">
              <Upload className="w-4 h-4" /> Upload Image
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
            </label>
          </div>
        )}

        {permState === 'ok' && (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {/* viewfinder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-72 rounded-3xl border-2 border-eco-green" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}>
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-eco-green"
                  style={{ boxShadow: '0 0 12px #00e5a0' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {(analyzing || modelLoading) && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="w-10 h-10 text-eco-green animate-spin" />
            <p className="text-white font-bold mt-4">{modelLoading ? 'Loading classifier...' : 'Analyzing waste type...'}</p>
          </div>
        )}

        {detection && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-24 left-4 right-4 glass-deep rounded-2xl p-5 z-20"
          >
            <p className="text-xs text-eco-green font-bold uppercase tracking-wider">Detected</p>
            <p className="text-lg font-extrabold text-white capitalize">{detection.rawLabel}</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="surface-raised rounded-lg p-2 text-center"><p className="text-[10px] text-muted-foreground-2 uppercase">Category</p><p className="font-bold text-eco-blue text-sm">{detection.category}</p></div>
              <div className="surface-raised rounded-lg p-2 text-center"><p className="text-[10px] text-muted-foreground-2 uppercase">Est. weight</p><p className="font-bold text-white text-sm">{detection.weightKg} kg</p></div>
              <div className="surface-raised rounded-lg p-2 text-center"><p className="text-[10px] text-muted-foreground-2 uppercase">Conf.</p><p className="font-bold text-eco-amber text-sm">{detection.confidence}%</p></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDetection(null)} className="flex-1 h-11 rounded-xl bg-surface-raised border border-border text-white font-bold flex items-center justify-center gap-1"><RotateCcw className="w-4 h-4" /> Scan Again</button>
              <button
                onClick={() => { onResult({ category: detection.category, weightKg: detection.weightKg }); onClose(); }}
                className="flex-1 h-11 rounded-xl btn-eco font-bold"
              >
                Use This
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {permState === 'ok' && !detection && (
        <div className="p-4 flex justify-center">
          <button onClick={capture} className="w-20 h-20 rounded-full btn-eco border-4 border-white/40 flex items-center justify-center" disabled={analyzing || modelLoading}>
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
