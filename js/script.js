// script.js の内容

document.addEventListener('DOMContentLoaded', function() {
    // PC表示の場合のみプレビュー機能を有効にする
    if (window.matchMedia("(min-width: 1200px)").matches) {
        const previewContainer = document.getElementById('preview-container');
        const previewIframe = document.getElementById('preview-iframe');
        const loadingOverlay = document.getElementById('loading-overlay'); 
        const workLinks = document.querySelectorAll('header h3.link');

        let hidePreviewTimeout; 
        let loadStartTime; 

        // --- ここから追加 ---
        let previewCooldownActive = true; // クールダウンフラグを初期状態でtrueに設定
        const cooldownDuration = 1000; // クールダウン期間 (ミリ秒)

        // ページロード後、クールダウン期間が終了したらフラグを解除
        setTimeout(() => {
            previewCooldownActive = false;
        }, cooldownDuration);
        // --- ここまで追加 ---

        // ロード画面を非表示にする関数を定義
        const hideLoadingOverlay = () => {
            const minDisplayTime = 500; 
            const elapsedTime = Date.now() - loadStartTime; 

            if (elapsedTime < minDisplayTime) {
                setTimeout(() => {
                    loadingOverlay.classList.remove('is-active');
                }, minDisplayTime - elapsedTime);
            } else {
                loadingOverlay.classList.remove('is-active');
            }
        };

        workLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                // --- ここから変更 ---
                // クールダウン期間中はプレビュー表示をスキップ
                if (previewCooldownActive) {
                    return; 
                }
                // --- ここまで変更 ---

                clearTimeout(hidePreviewTimeout);

                const href = this.closest('a').href;
                
                if (href) {
                    loadStartTime = Date.now();
                    loadingOverlay.classList.add('is-active');
                    
                    previewIframe.style.visibility = 'hidden'; 
                    previewIframe.style.opacity = '0'; 

                    if (previewIframe.src !== href) {
                        previewIframe.src = href;
                    } else {
                        hideLoadingOverlay();
                    }
                    
                    previewContainer.classList.add('is-active');
                }
            });

            link.addEventListener('mouseleave', function() {
                // --- ここから変更 ---
                // クールダウン期間中であってもmouseleaveは処理する
                // (クールダウン期間中に誤って表示されたプレビューを消せるように)
                // if (previewCooldownActive) {
                //    return; // 不要、このif文は削除またはコメントアウト
                // }
                // --- ここまで変更 ---

                hidePreviewTimeout = setTimeout(() => {
                    if (!previewContainer.matches(':hover')) {
                        previewContainer.classList.remove('is-active');
                        loadingOverlay.classList.remove('is-active');
                    }
                }, 150);
            });
        });

        previewContainer.addEventListener('mouseleave', function() {
            hidePreviewTimeout = setTimeout(() => {
                if (!previewContainer.matches(':hover')) {
                    previewContainer.classList.remove('is-active');
                    loadingOverlay.classList.remove('is-active');
                }
            }, 150);
        });

        previewContainer.addEventListener('mouseenter', function() {
            clearTimeout(hidePreviewTimeout);
        });

        previewIframe.onload = function() {
            try {
                const iframeDoc = previewIframe.contentWindow.document;
                if (iframeDoc) {
                    const h5Elements = iframeDoc.querySelectorAll('h5');
                    h5Elements.forEach(h5 => {
                        h5.style.display = 'none';
                    });

                    const mobileNav = iframeDoc.querySelector('.mobile-navigation');
                    if (mobileNav) {
                        mobileNav.style.display = 'none';
                    }

                    const footer = iframeDoc.querySelector('footer');
                    if (footer) {
                        footer.style.display = 'none';
                    }
                }
                previewIframe.style.visibility = 'visible'; 
                previewIframe.style.opacity = '1'; 

                hideLoadingOverlay();
            } catch (e) {
                console.warn("iframe content access blocked:", e);
                hideLoadingOverlay();
            }
        };
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileNav = document.getElementById('mobile-navigation');

    if (!menuButton || !mobileNav) {
        console.error('メニューボタンまたはナビゲーション要素が見つかりません。');
        return;
    }

    menuButton.addEventListener('click', function() {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isOpen);
        mobileNav.setAttribute('aria-hidden', isOpen);
        mobileNav.classList.toggle('is-open');
    });
});