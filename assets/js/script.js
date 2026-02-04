document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope');
    const letter = document.getElementById('letter');
    
    // Animation timing constants (ms)
    const EXTRACT_DELAY = 600;
    const FULLSCREEN_DELAY = 1800;

    let isOpened = false;

    envelopeWrapper.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        // 1. Open envelope
        envelopeWrapper.classList.add('open');

        // 2. Extract letter
        setTimeout(() => {
            letter.classList.add('extracted');
        }, EXTRACT_DELAY);

        // 3. Fullscreen expansion
        setTimeout(() => {
            // Lock current position before animating to fullscreen
            const rect = letter.getBoundingClientRect();
            
            // Disable transition to prevent jump
            letter.style.transition = 'none';
            letter.style.webkitTransition = 'none';

            // Fix position
            letter.style.position = 'fixed';
            letter.style.top = `${rect.top}px`;
            letter.style.left = `${rect.left}px`;
            letter.style.width = `${rect.width}px`;
            letter.style.height = `${rect.height}px`;
            
            // Force GPU acceleration
            letter.style.transform = 'translate3d(0, 0, 0)'; 
            
            letter.style.zIndex = '999';
            letter.style.margin = '0';
            document.body.appendChild(letter);

            // Force Reflow
            void letter.offsetWidth;
            
            // Double rAF to ensure rendering is ready before starting animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Restore transition for smooth expansion
                    letter.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
                    letter.style.webkitTransition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';

                    const isMobile = window.innerWidth < 600;
                    
                    letter.style.top = '50%';
                    letter.style.left = '50%';
                    letter.style.width = isMobile ? '92vw' : '80vw';     
                    letter.style.maxWidth = '800px'; 
                    letter.style.height = '85vh';
                    
                    // Maintain 3D transform for performance
                    letter.style.transform = 'translate3d(-50%, -50%, 0)';
                    
                    letter.style.borderRadius = '10px';
                    letter.classList.add('full-mode');
                });
            });

            // 4. Move envelope away
            envelopeWrapper.classList.add('move-down');
            document.body.style.overflow = 'auto';

        }, FULLSCREEN_DELAY);
    });
});