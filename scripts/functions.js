const save = (save) => {
    if (!save) {
        alertModal('確定刪除一切? 這個動作無法挽回!', [
            {
                text: '確定',
                onclick: () => {
                    $.jStorage.flush()
                    window.location.reload()
                }
            }, '取消'
        ])
        return 'reset'
    }
    $.jStorage.set('memorizer-save', save)
}

const compareObj = (object1, object2, deep = false) => {
    if (deep) return JSON.stringify(object1) === JSON.stringify(object2)

    let keys1 = Object.keys(object1)
    let keys2 = Object.keys(object2)

    if (keys1.length !== keys2.length) return false

    for (let key of keys1) {
        if (!keys2.includes(key)) return false
        if (object1[key] !== object2[key]) return false
    }

    return true
}

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const compareArray = (a, b, deep = false) => {
    if (!deep) {
        a.sort()
        b.sort()
    }
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}


const identicalRate = (string1, string2) => {
    string1 = string1.toString().trim().toLowerCase();
    string2 = string2.toString().trim().toLowerCase();
    if (string1 === string2) return '100.00'
    const length = Math.max(string1.length, string2.length)
    let sameCount = 0
    for (let i = 0; i < length; i++) {
        if (string1.includes(string2[i])) sameCount++
    }
    let sameCount2 = 0;
    if (compareArray(string1.split('').sort(), string1.split('').sort()))
        for (let i = 0; i < length; i++) {
            if (string1[i] === string2[i]) sameCount2++
        }
    else sameCount2 = sameCount
    return (((sameCount / length) * 0.6 + (string1.length > string2.length ?
        string2.length / string1.length : string1.length / string2.length
    ) * 0.2 + (sameCount2 / length) * 0.2
    ) / 0.03
    ).toFixed(2)
}

const avrage = ([...array]) => {
    array = array.map(n => parseFloat(n))
    return (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2)
}

const toTimePassed = (timeFrom) => {
    let now = Date.now()
    let diff = now - timeFrom
    let seconds = parseFloat((diff / 1000).toFixed(2)) > 10 ? (diff / 1000).toFixed(2) : '0' + (diff / 1000).toFixed(2)
    let minutes = Math.floor(seconds / 60) > 10 ? Math.floor(seconds / 60) : '0' + Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60) > 10 ? Math.floor(minutes / 60) : '0' + Math.floor(minutes / 60)
    if (hours > 0) return `${hours}:${minutes}:${seconds}`
    return `${minutes}:${seconds}`
}

const openModal = (className) => {
    document.querySelector(`.${className}`).classList.add('show')
}

const closeModal = (className) => {
    document.querySelector(`.${className}`).classList.remove('show')
}

let showNotif = (text, time = 5) => {
    const notif = $('.notif')
    notif.text(text)
    notif[0].style.opacity = '1'
    setTimeout(() => {
        notif[0].style.opacity = '0'
    }, time * 1000)
}

const toggleShowSidebar = (show) => {
    // i couldnt use css classes idk why 😭
    if (show === undefined || show === null) {
        let isHidden = $('.sidebar')[0].style.opacity === '0' && $('.open-sb')[0].style.opacity === '0'
        $('.sidebar')[0].style.opacity = isHidden ? '1' : '0'
        $('.open-sb')[0].style.opacity = isHidden ? '1' : '0'
        $('.sidebar')[0].style.pointerEvents = isHidden ? 'auto' : 'none'
        $('.open-sb')[0].style.pointerEvents = isHidden ? 'auto' : 'none'
        $('.menu').toggleClass('fullpanel')
    } else if (show) {
        $('.sidebar')[0].style.opacity = '1'
        $('.open-sb')[0].style.opacity = '1'
        $('.sidebar')[0].style.pointerEvents = 'auto'
        $('.open-sb')[0].style.pointerEvents = 'auto'
        $('.menu').removeClass('fullpanel')
    } else if (show === false) {
        $('.sidebar')[0].style.opacity = '0'
        $('.open-sb')[0].style.opacity = '0'
        $('.sidebar')[0].style.pointerEvents = 'none'
        $('.open-sb')[0].style.pointerEvents = 'none'
        $('.menu').addClass('fullpanel')
    }
}

const saveAs = (blob, filename) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    a.remove();
}

// modified alertModal to fit 3 buttons
const alertModal = (text, options) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add('alert-modal')
    modal.innerHTML = `
    <div class="content">
        <h3>${text}</h3>
        <button>OK</button>
    </div>
    `;
    let content = modal.querySelector('.content')
    let b = content.querySelector('button')
    if (typeof options === 'string' || options instanceof String) {
        b.innerHTML = options;
        b.addEventListener("click", () => {
            modal.classList.remove('show')
            setTimeout(() => modal.remove(), 1000)
        });
    } else if (typeof options === 'array' || options instanceof Array) {
        b.remove()
        b = document.createElement('div')
        b.classList.add('buttons')
        b.style.display = 'flex'
        b.style.justifyContent = 'space-around'
        b.style.flexWrap = 'wrap'
        options.forEach(e => {
            let eb = document.createElement('button')
            if (typeof e === 'string' || e instanceof String) {
                eb.innerHTML = e
                eb.addEventListener("click", () => {
                    modal.classList.remove('show')
                    setTimeout(() => modal.remove(), 1000)
                });
            } else if (typeof e === 'object' || e instanceof Object) {
                eb.innerHTML = e.text
                const hide = () => {
                    modal.classList.remove('show')
                    setTimeout(() => modal.remove(), 1000)
                }
                eb.addEventListener("click", () => {
                    hide()
                    e.onclick(eb)
                })
            }
            b.appendChild(eb)
        })
        content.appendChild(b)
    } else if (!options) {
        b.addEventListener("click", () => {
            modal.classList.remove('show')
            setTimeout(() => modal.remove(), 1000)
        });
    }
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 1)
}

const toggleSidebar = () => {
    $('.sidebar').toggleClass('show')
    $('.open-sb').html($('.sidebar').hasClass('show') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-list"></i>')
}

const toggleMode = (m) => {
    let mode = getComputedStyle(document.documentElement).getPropertyValue(`color-scheme`)
    let modes = [
        "light",
        "dark",
        "light dark"
    ]
    let nextMode = m || modes[(modes.indexOf(mode) + 1) % modes.length]
    let modeText;
    if (nextMode === "light") modeText = "明亮"
    else if (nextMode === "dark") modeText = "黑暗"
    else if (nextMode === "light dark") modeText = "自動"
    $('.change-mode').text('切換顏色模式: ' + modeText)
    saveFile.mode = nextMode
    save(saveFile)
    return document.documentElement.style.setProperty(`color-scheme`, nextMode)
}

const toggleConfetti = (t) => {
    saveFile.confetti = t === undefined ? !saveFile.confetti : t
    $('.confetti').text('彩帶: ' + (saveFile.confetti ? '開' : '關'))
}

const openMenu = (e) => {
    $('.container .menu.show').removeClass('show')
    $('.sidebar button[data-selected="true"]').attr('data-selected', false)
    $(`#${e}`).attr('data-selected', true)
    openModal(e)
}

const addQuestion = (question = '', answer = '') => {
    let q = $(`<div class="question" data-question-index="${$('.question').length}">
                    <div>
                            <label for="question-input">問題:</label>
                            <input type="text" id="question-input" placeholder="輸入題目"><br>
                            <label for="question-answer">答案:</label>
                            <textarea rows="3" id="question-answer" placeholder="輸入答案"></textarea>
                    </div>
                    <button class="remove-question-button" onclick="removeQuestion(${$('.question').length})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`)
    $('.memorization-questions').append(q)
    q.find('#question-input').val(question)
    q.find('#question-answer').val(answer)
}

const removeQuestion = (e) => {
    $('.question')[e].remove()
    for (let i = e; i <= $('.question').length; i++) {
        $($('.question')[i]).attr('data-question-index', i)
        $($('.question')[i]).find('.remove-question-button').attr('onclick', `removeQuestion(${i})`)
    }
}

const downloadMem = (name) => {
    let mem = saveFile.memorizations.find(m => m.name === name)
    if (!mem) return showNotif('錯誤! 找不到背書檔!')
    let csv = JSON.stringify(mem)
    let blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${mem.name}.json`);
}

const uploadMem = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.multiple = true;
    input.onchange = () => {
        $.each(input.files, (i, file) => {
            let reader = new FileReader();
            reader.onload = () => {
                let json = JSON.parse(reader.result),
                    originalName = json.name,
                    i = 0;
                while (saveFile.memorizations.find(mem => mem.name === json.name)) {
                    i++;
                    json.name = originalName + `(${i})`
                }
                saveFile.memorizations.push(json);
                reloadMemorizations();
                input.remove();
            }
            reader.readAsText(file);
        })
    }
    input.click();
}

const removeMemorization = (name) => {
    alertModal(`確定刪除「${name}」?`, [
        {
            text: '確定',
            onclick: () => {
                saveFile.memorizations = saveFile.memorizations.filter(m => !(m.name === name))
                reloadMemorizations()
            }
        }, '取消'
    ])
}

const editMemorization = (name) => {
    let mem = typeof name === 'object' ? name : saveFile.memorizations.find(m => m.name === name)
    openMenu('create-memorization')
    $('.create-memorization.menu h1').text('編輯背書檔')
    $('.finish').attr('onclick', '')
    $('.finish').off('click')
    $('.finish').on('click', () => finish(mem))
    $('#memorization-name').val(mem.name)
    $('.memorization-questions').empty()
    mem.questions.forEach(q => {
        addQuestion(q.question, q.answer)
    })
    toggleShowSidebar(false)
}

const reloadMemorizations = () => {
    $('.memorizations').empty()
    saveFile.memorizations.sort()
    $.each(saveFile.memorizations, (i, m) => {
        let memorizationHTML = $(`
                <div class="mem">
                    <h3></h3>
                    <b>題目數量: ${m.questions.length}</b><br>
                    <button class="remove">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="edit">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="preview">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="download">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <button class="start-memorizing">
                        開始背!
                    </button>
                </div>
        `)
        $('.memorizations').append(memorizationHTML)
        memorizationHTML.find('h3').text(m.name)
        memorizationHTML.find('.remove').click(() => removeMemorization(m.name))
        memorizationHTML.find('.edit').click(() => editMemorization(m))
        memorizationHTML.find('.preview').click(() => {
            openMenu('view-memorization')
            $('.view-memorization .view-questions').empty()
            m.questions.forEach(question => {
                $('.view-memorization .view-questions').append(`
                    <div class="question-preview">
                        <h3 class="question-content">Q: ${question.question}</h3>
                        <b class="answer-content">A: ${question.answer}</b>
                    </div>`)
            })
        })
        memorizationHTML.find('.download').click(() => downloadMem(m.name))
        memorizationHTML.find('.start-memorizing').click(() => {
            toggleShowSidebar(false)
            openMenu('memorizing')
            $('.memorizing .view-questions').empty()
            m.questions.forEach(question => {
                $('.memorizing .view-questions').append(`
                    <div class="question-preview">
                        <h3 class="question-content">Q: ${question.question}</h3>
                        <b class="answer-content">A: ${question.answer}</b>
                    </div>`)
            })
            $('.ready').off('click')
            $('.ready').on('click', () => startMemorization(m.name))
        })
    })
}

const finish = (memorization) => {
    if (memorization && typeof memorization === 'string') {
        memorization = saveFile.memorizations.find(m => m.name === memorization)
    }
    if (
        (memorization && saveFile.memorizations.filter(e => !compareObj(memorization, e)).find(e => e.name === $('#memorization-name').val())) ||
        (!memorization && saveFile.memorizations.find(e => e.name === $('#memorization-name').val()))
    ) {
        showNotif('名稱有重複!')
        $('#memorization-name').focus()
        return;
    }
    if (!$('#memorization-name').val()) {
        showNotif('請輸入名稱!')
        $('#memorization-name').focus()
        return;
    }
    let m = {
        name: $('#memorization-name').val(),
        questions: []
    }
    let hasIncompleteQuestions = false,
        noQuestions = true
    $.each($('.question'), (i, question) => {
        noQuestions = false;
        let q = $(question).find('#question-input').val(),
            a = $(question).find('#question-answer').val()
        if (!q || !a) return hasIncompleteQuestions = true;
        m.questions.push({
            question: q,
            answer: a,
        })
    })
    if (hasIncompleteQuestions) return showNotif('問題尚未輸入完整!');
    if (noQuestions) return showNotif('你沒有輸入問題!');
    toggleShowSidebar(true)
    openMenu('home')
    if (memorization && saveFile.memorizations.find(e => compareObj(e, memorization)))
        saveFile.memorizations = saveFile.memorizations.filter(e => !compareObj(e, memorization));
    saveFile.memorizations.push(m)
    reloadMemorizations()
    $('.memorization-questions').empty()
    return true;
}

const startMemorization = (name) => {
    let mem = saveFile.memorizations.find(m => m.name === name),
        time = Date.now();
    if (!mem) return showNotif('錯誤! 找不到背書檔!')
    toggleShowSidebar(false)
    openMenu('memorizer')
    let currentQuestionIndex = 0,
        questions = shuffle(mem.questions),
        userAnswers = questions.map(question => ({ question: question }))
    $('.memorizer h1').text('測驗 - ' + name)

    const next = () => {
        $('#ans').focus()
        currentQuestionIndex++
        if (currentQuestionIndex >= questions.length) $('.next-question').text('完成')
        else $('.next-question').html('下一題 <i class="fa-solid fa-angles-right"></i>')
        if (currentQuestionIndex > questions.length) {
            $('.next-question').off('click')
            $('.memorizer-results .view-questions').empty()
            let scores = []
            questions.forEach((q, i) => {
                const userAnswer = userAnswers[i].answer
                const resultHTML = $(`
                    <div class="question-preview">
                        <h3 class="question-content">問題: ${q.question}</h3>
                        <b class="answer-content">正確答案: ${q.answer}</b>
                        <b>你的答案: ${userAnswer}</b>
                        <b class="identical-rate">相似度: ${identicalRate(q.answer, userAnswer)}</b>
                    </div>`)
                $('.memorizer-results .view-questions').append(resultHTML)
                resultHTML.find('.identical-rate')[0].style.color =
                    identicalRate(q.answer, userAnswer) >= 90 ? '#0f0' :
                        identicalRate(q.answer, userAnswer) >= 70 ? '#9f0' :
                            identicalRate(q.answer, userAnswer) >= 50 ? '#ff0' :
                                identicalRate(q.answer, userAnswer) >= 30 ? '#f90' : '#f00';
                // this looks beautiful and ugly at the same time idk how
                scores.push(identicalRate(q.answer, userAnswer));
            })
            $('.memorizer-results h2').text(`成績: ${avrage(scores)}`)
            $('.memorizer-results h2')[0].style.color =
                avrage(scores) >= 90 ? '#0f0' :
                    avrage(scores) >= 70 ? '#9f0' :
                        avrage(scores) >= 50 ? '#ff0' :
                            avrage(scores) >= 30 ? '#f90' : '#f00';
            // this half pyramid reminds me of that beautiful c++ program that i wrote and that scary ahh tutorial code in UH
            if (avrage(scores) >= 80 && saveFile.confetti) confetti({
                particleCount: 100,
                spread: 360,
                origin: { y: 0.5 },
            });
            $('.time-passed').text('經過時間: ' + toTimePassed(time))
            openMenu('memorizer-results')
            return
        }
        let question = questions[currentQuestionIndex - 1]
        $('#que').text(question.question)
        $('#ans').val('')
        $('.question-count').text(`${currentQuestionIndex}/${questions.length}`)
        $('.next-question').off('click')
        $('.next-question').on('click', () => {
            $('#ans').focus()
            if (!$('#ans').val().trim()) {
                return showNotif('請輸入您的答案!')
            }
            userAnswers[currentQuestionIndex - 1].answer = $('#ans').val()
            next()
        })
    }
    next()
}

const loadTemplates = () => {
    $('.template-list').text('載入中...')
    const url = 'https://gamingdimigd.github.io/Memorizer-Templates/'
    $.ajax(url + 'h.json').done(data => {
        $('.template-list').empty()
        data.forEach(t => {
            $.ajax(url + 'templates/' + t + '.json').done(data => {
                let templateHTML = $(`
                <div class="mem">
                    <h3></h3>
                    <b>題目數量: ${data.questions.length}</b><br>
                    <button class="preview">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="download">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    <button class="add-template">
                        <i class="fa-solid fa-plus"></i> 加入
                    </button>
                </div>
                </div>`)
                templateHTML.find('h3').text(data.name)
                $('.template-list').append(templateHTML)
                templateHTML.find('.preview').click(() => {
                    openMenu('view-memorization')
                    $('.view-memorization .view-questions').empty()
                    data.questions.forEach(question => {
                        $('.view-memorization .view-questions').append(`
                        <div class="question-preview">
                            <h3 class="question-content">Q: ${question.question}</h3>
                            <b class="answer-content">A: ${question.answer}</b>
                        </div>`)
                    })
                })
                templateHTML.find('.download').click(() => downloadMem(m.name))
                templateHTML.find('.add-template').click(() => {
                    let saved = { ...data }
                    let originalName = data.name
                    let i = 0
                    while (saveFile.memorizations.find(mem => mem.name === saved.name)) {
                        i++;
                        saved.name = originalName + `(${i})`
                    }
                    saveFile.memorizations.push(saved)
                    reloadMemorizations()
                    $('#home')[0].click()
                    showNotif('已加入背書檔!')
                })
            })
        })
    })
}