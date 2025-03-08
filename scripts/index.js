let initSaveFile = {
    memorizations: [],
    mode: 'light dark',
    confetti: true,
}

let saveFile = $.jStorage.get('memorizer-save') || initSaveFile;

if (Object.keys(saveFile).length < Object.keys(initSaveFile).length) {
    Object.keys(initSaveFile).forEach(key => {
        if (!saveFile.hasOwnProperty(key)) {
            saveFile[key] = initSaveFile[key]
        }
    })
}

$.each($('.sidebar button'), (i, e) => {
    e.onclick = () => {
        openMenu(e.id)
        $('.open-sb')[0].click()
    }
})

$('#templates').on('click', loadTemplates)

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        $('.next-question')[0].click();
    }
});

$('.back').html('<i class="fa-solid fa-house"></i> 回首頁')
$('.back').on('click', () => {
    toggleShowSidebar(true)
    openMenu('home')
})

toggleMode(saveFile.mode)
toggleConfetti(saveFile.confetti)

setInterval(() => save(saveFile), 1000)

reloadMemorizations()

const version = 'v1.1.0'

const updateInfo = [
    {
        version: 'v1.0.0',
        title: '小工具釋出!',
        description: [
            {
                title: '給每位學生的禮物',
                text: 'Memorizer 背書神器是個背書專用的網站，可以提供學生對我而言最佳的背書方式。'
            },
            {
                title: '有點不贊成背書，但...',
                text: '人生一定有些是要背的，像九九乘法表，但我到現在還是不懂的事情是: 為什麼要背注釋!!!'
            }
        ]
    },
    {
        version: 'v1.1.0',
        title: '新增背書檔資料庫!',
        description: [
            {
                title: '新增資料庫!',
                text: '不一定要自己製作背書檔!'
            },
            {
                title: '修復顯示bug',
                text: '修復令人不舒服的側欄按鈕偏移問題。'
            }
        ]
    },
    {
        version: 'v1.1.1',
        title: 'bug修復',
        description: [
            {
                title: '修復計算相似度的演算法',
                text: '讓他不那麼嚴格'
            }
        ]
    }
].reverse();

$('.version').text(version)

const umud = $('.version-history')[0]

updateInfo.forEach(u => {
    umud.innerHTML += `<h2>${u.version} - ${u.title}</h2>`
    u.description.forEach(d => {
        umud.innerHTML += `<h3>- ${d.title}</h3>`
        umud.innerHTML += `<p>${d.text}</p><br/>`
    })
})