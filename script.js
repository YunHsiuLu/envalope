document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.getElementById('envelope');
    const letter = document.getElementById('letter');
    let isOpened = false;

    envelopeWrapper.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        // 1. 打開信封
        envelopeWrapper.classList.add('open');

        // 2. 抽出信紙 (抽出時，CSS 會顯示 letter-cover: test2.png)
        setTimeout(() => {
            letter.classList.add('extracted');
        }, 600);

        // 3. 全螢幕展開
        setTimeout(() => {
            
            // --- 步驟 A: 鎖定位置 ---
            const rect = letter.getBoundingClientRect();
            
            // ★ 修改：先暫停 transition，避免瞬間瞬移被看到動畫
            letter.style.transition = 'none';
            letter.style.webkitTransition = 'none'; // 針對 iOS Safari

            // 固定位置 (這段保持不變)
            letter.style.position = 'fixed';
            letter.style.top = `${rect.top}px`;
            letter.style.left = `${rect.left}px`;
            letter.style.width = `${rect.width}px`;
            letter.style.height = `${rect.height}px`;
            
            // ★ 關鍵修改：加上 translateZ(0) 強制 GPU 接手
            letter.style.transform = 'translate3d(0, 0, 0)'; 
            
            letter.style.zIndex = '999';
            letter.style.margin = '0';
            document.body.appendChild(letter);

            // --- 步驟 B: 強制重繪 (Reflow) ---
            // 讀取兩次 offsetWidth 確保 iOS 真的醒過來
            void letter.offsetWidth;
            
            // ★ 小技巧：用 requestAnimationFrame 包兩層
            // 這能確保下一幀渲染時，位置已經鎖定好了，才開始跑動畫
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    
                    // --- 步驟 C: 執行放大 ---
                    // 恢復 transition
                    letter.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
                    letter.style.webkitTransition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';

                    const isMobile = window.innerWidth < 600;
                    
                    letter.style.top = '50%';
                    letter.style.left = '50%';
                    letter.style.width = isMobile ? '92vw' : '80vw';     
                    letter.style.maxWidth = '800px'; 
                    letter.style.height = isMobile ? '85vh' : '85vh';
                    
                    // ★ 保持 3D 屬性
                    letter.style.transform = 'translate3d(-50%, -50%, 0)';
                    
                    letter.style.borderRadius = '10px';
                    letter.classList.add('full-mode');
                });
            });

            // --- 步驟 D: 信封退場 ---
            envelopeWrapper.classList.add('move-down');
            document.body.style.overflow = 'auto';

        }, 1800);
    });
});
