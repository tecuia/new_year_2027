document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    function scaleApp() {
        const scale = Math.min(window.innerWidth / 360, window.innerHeight / 800);
        app.style.transform = `scale(${scale})`;
    }
    
    window.addEventListener('resize', scaleApp);
    scaleApp();

    const scenes = {
        intro: document.getElementById('scene-intro'),
        shake: document.getElementById('scene-shake'),
        news: document.getElementById('scene-news'),
        packshot: document.getElementById('scene-packshot')
    };

    const btnShake = document.getElementById('btn-shake');
    const btnNextNews = document.getElementById('btn-next-news');
    
    const shakeVideo = document.getElementById('shake-video');
    const newsVideo = document.getElementById('news-video');
    const packshotVideo = document.getElementById('packshot-video');
    
    const newsMainTitle = document.getElementById('news-main-title');
    const newsTextBlock = document.getElementById('news-text-block');

    const audioBtn = document.getElementById('audio-btn');
    const soundIcon = document.getElementById('sound-icon');
    const bgMusic = document.getElementById('bg-music');

    let introTimer, newsTimer;
    let currentNewsIndex = 0;
    let isMusicPlaying = true;

    bgMusic.volume = 0.1;

    bgMusic.play().catch(() => {
        const playAudioOnFirstClick = () => {
            if (isMusicPlaying) {
                bgMusic.play().catch(e => console.log(e));
            }
            document.removeEventListener('click', playAudioOnFirstClick);
            document.removeEventListener('touchstart', playAudioOnFirstClick);
        };
        document.addEventListener('click', playAudioOnFirstClick);
        document.addEventListener('touchstart', playAudioOnFirstClick);
    });

    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMusicPlaying) {
            bgMusic.pause();
            soundIcon.src = 'imgs/sound_off.svg';
            isMusicPlaying = false;
        } else {
            bgMusic.play().catch(e => console.log(e));
            soundIcon.src = 'imgs/sound_on.svg';
            isMusicPlaying = true;
        }
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ТЕПЕРЬ ТУТ СТРОГО 2 ИСТОРИИ
    const newsData = [
        {
            video: 'vid/news1.mp4',
            title: 'Вы всё-таки встретились на тот самый кофе',
            text: 'Собирались на полчаса. Заказали вторую чашку, потом десерт. Следующую встречу назначили сразу, пока все ещё за столом.'
        },
        {
            video: 'vid/news2.mp4',
            title: 'Тот самый звонок, которого вы ждали',
            text: 'Проект утвердили, бюджет согласовали, а команда наконец-то выдохнула и улыбнулась. Всё получилось именно так, как вы хотели.'
        }
    ];

    shuffleArray(newsData);

    function showScene(sceneName) {
        Object.values(scenes).forEach(scene => scene.classList.remove('active'));
        if (scenes[sceneName]) {
            scenes[sceneName].classList.add('active');
        }
    }

    // Анимации текста занимают 2 секунды. Ждем еще 3.5 сек = 5.5 сек.
    setTimeout(() => {
        btnShake.classList.add('show', 'shake-anim');
    }, 5500);

    // Автопереход через 5 секунд после появления кнопки = 10.5 сек.
    introTimer = setTimeout(startShakeScene, 10500);

    btnShake.addEventListener('click', () => {
        clearTimeout(introTimer);
        startShakeScene();
    });

    function startShakeScene() {
        showScene('shake');
        btnShake.classList.remove('show', 'shake-anim');
        
        const shakeVideos = [
            'vid/snowball_1_shake_mobile.mp4',
            'vid/snowball_2_shake_mobile.mp4',
            'vid/snowball_3_shake_mobile.mp4'
        ];
        
        const randomVideo = shakeVideos[Math.floor(Math.random() * shakeVideos.length)];
        shakeVideo.src = randomVideo;
        shakeVideo.load();
        
        shakeVideo.play().catch(() => setTimeout(startNewsScene, 8000));

        shakeVideo.onended = () => startNewsScene();
    }

    function startNewsScene() {
        showScene('news');
        currentNewsIndex = 0;
        loadNews(currentNewsIndex);
    }

    function loadNews(index) {
        clearTimeout(newsTimer);
        btnNextNews.classList.remove('show');
        
        const currentNews = newsData[index];
        newsMainTitle.innerHTML = currentNews.title.replace(/\n/g, '<br>');
        newsTextBlock.textContent = currentNews.text;
        
        // Перезапускаем анимацию появления текста
        const animElements = document.querySelectorAll('.anim-news-text');
        animElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // Вызов принудительного перерасчета (reflow)
            el.style.animation = null; 
        });

        newsVideo.src = currentNews.video;
        newsVideo.load();
        newsVideo.play().catch(e => console.log(e));

        newsVideo.onended = onNewsVideoEnded;
    }

    function onNewsVideoEnded() {
        // Если это последняя (вторая) новость -> скрываем кнопку и ждем 5 сек до пэкшота
        if (currentNewsIndex >= newsData.length - 1) {
            btnNextNews.classList.remove('show');
            newsTimer = setTimeout(startPackshotScene, 5000);
        } else {
            // Если это первая новость -> показываем кнопку и ждем 5 сек
            btnNextNews.classList.add('show');
            newsTimer = setTimeout(startPackshotScene, 5000);
        }
    }

    btnNextNews.addEventListener('click', () => {
        clearTimeout(newsTimer);
        currentNewsIndex++;
        loadNews(currentNewsIndex);
    });

    function startPackshotScene() {
        showScene('packshot');
        packshotVideo.play().catch(e => console.log(e));
    }
});