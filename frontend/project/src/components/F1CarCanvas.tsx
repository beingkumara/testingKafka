import React, { useRef, useEffect, useState } from 'react';
import { useMotionValueEvent, MotionValue } from 'framer-motion';

interface F1CarCanvasProps {
    scrollProgress: MotionValue<number>;
}

const F1CarCanvas: React.FC<F1CarCanvasProps> = ({ scrollProgress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Number of frames in the sequence
    const frameCount = 96;

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            // Use Vite's glob import to get all images from the directory
            const modules = import.meta.glob('/src/assets/sequence/*.jpg', { eager: true, as: 'url' });

            // Convert to array of paths and sort them
            const sortedPaths = Object.keys(modules).sort((a, b) => {
                // Extract number from filename: ezgif-frame-001.jpg -> 1
                const getNum = (path: string) => parseInt(path.match(/(\d+)\.jpg$/)?.[1] || '0');
                return getNum(a) - getNum(b);
            }).map(key => modules[key]); // modules[key] is the string URL because of { as: 'url' }

            const loadedImages: HTMLImageElement[] = [];
            const imagePromises: Promise<void>[] = sortedPaths.map((src, index) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => {
                        loadedImages[index] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        resolve();
                    };
                });
            });

            await Promise.all(imagePromises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Draw frame based on scroll
    useMotionValueEvent(scrollProgress, "change", (latest: number) => {
        if (!isLoaded || images.length === 0 || !canvasRef.current) return;

        // Map 0-1 progress to 0-(frameCount-1)
        const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(latest * (frameCount - 1))
        );

        requestAnimationFrame(() => updateCanvas(frameIndex));
    });

    const updateCanvas = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const img = images[index];
        if (!img) return;

        // Ensure canvas dimensions are set (handled by resize listener usually, but check here)
        // We use the internal coordinate system which should match retina resolution
        // The scale transformation is persistent unless reset


        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;

        // Calculate scales based on the current canvas dimensions (which matched display * dpr)
        // We don't reset width/height here to avoid state loss and performance hit
        // Assuming width/height are set by the resize handler

        const scale = Math.min(
            displayWidth / img.width,
            displayHeight / img.height
        );

        const x = (displayWidth / 2) - (img.width / 2) * scale;
        const y = (displayHeight / 2) - (img.height / 2) * scale;

        // Clear using the logical width/height (because of scale transform)
        context.clearRect(0, 0, displayWidth, displayHeight);

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    // Initial draw on load and resize
    useEffect(() => {
        if (isLoaded && images.length > 0 && canvasRef.current) {

            // Initial setup of canvas size
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (context) {
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                context.scale(dpr, dpr);
            }

            // Force initial draw at 0
            updateCanvas(0);

            const onResize = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const context = canvas.getContext('2d');
                if (!context) return;

                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                context.scale(dpr, dpr);

                const currentProgress = scrollProgress.get();
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(currentProgress * (frameCount - 1))
                );
                updateCanvas(frameIndex);
            };

            window.addEventListener('resize', onResize);
            return () => window.removeEventListener('resize', onResize);
        }
    }, [isLoaded, images, scrollProgress]);


    return (
        <div className="absolute inset-0 z-0 bg-[#050505] overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    filter: 'contrast(1.15) saturate(1.2) drop-shadow(0 0 50px rgba(0,0,0,0.5))'
                }}
                className="block object-contain"
            />
            {/* Fine Texture Overlays */}
            <div className="scanlines mix-blend-overlay opacity-20"></div>
            <div className="vignette mix-blend-multiply opacity-80"></div>

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-[#e10600] z-50">
                    <div className="text-xl font-bold tracking-[0.5em] animate-pulse">
                        INITIALIZING TELEMETRY...
                    </div>
                </div>
            )}
        </div>
    );
};

export default F1CarCanvas;
