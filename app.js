

const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `tab-${targetTab}`) {
                content.classList.add('active');
            }
        });
    });
});

const blackBoxNodes = document.querySelectorAll('.system-node, .system-core');
const tooltipDisplay = document.getElementById('blackbox-tooltip');

blackBoxNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
        const tooltipText = node.getAttribute('data-tooltip');
        tooltipDisplay.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${tooltipText}`;
        tooltipDisplay.style.borderColor = 'rgba(0, 210, 255, 0.4)';
    });
    
    node.addEventListener('mouseleave', () => {
        tooltipDisplay.innerHTML = `<i class="fa-solid fa-circle-info"></i> Наведите на любой элемент схемы для получения системного описания.`;
        tooltipDisplay.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    });
});

const factors = [
    { id: 'F1', name: 'Целеполагание (F1)', desc: 'Ясность целей и критериев успеха' },
    { id: 'F2', name: 'Методология (F2)', desc: 'Применение системных/междисциплинарных методов' },
    { id: 'F3', name: 'Обратная связь (F3)', desc: 'Сбор отзывов и адаптация процесса' },
    { id: 'F4', name: 'Ресурсное обеспечение (F4)', desc: 'Цифровая среда, лаборатории и LMS' },
    { id: 'F5', name: 'Связь с внешней средой (F5)', desc: 'Подготовка к рынку труда и стажировки' },
    { id: 'F6', name: 'Внутренняя удовлетворенность (F6)', desc: 'Мотивация и баланс учебной нагрузки' }
];

let surveysDb = {
    student: [
        [6, 5, 4, 2, 3, 1], 
        [5, 6, 3, 2, 4, 1],
        [6, 4, 3, 1, 5, 2],
        [5, 5, 4, 2, 3, 1],
        [6, 5, 3, 1, 4, 2],
        [4, 6, 3, 2, 5, 1],
        [5, 4, 4, 1, 3, 2],
        [6, 5, 2, 2, 4, 1]
    ],
    teacher: [
        [4, 2, 3, 5, 6, 1],
        [3, 1, 2, 4, 5, 6],
        [5, 2, 1, 3, 6, 4],
        [4, 1, 3, 2, 5, 6],
        [3, 2, 2, 4, 6, 1],
        [4, 1, 3, 5, 5, 2]
    ],
    admin: [
        [2, 3, 4, 5, 1, 6],
        [1, 2, 5, 4, 2, 6],
        [3, 2, 4, 3, 1, 5],
        [2, 3, 5, 4, 1, 6]
    ]
};

function seedDatabase() {
    
    for (let i = 0; i < 72; i++) {
        surveysDb.student.push(generateBiasedRank([5.5, 4.8, 3.2, 2.1, 4.0, 1.4]));
    }
    
    for (let i = 0; i < 9; i++) {
        surveysDb.teacher.push(generateBiasedRank([4.2, 1.8, 2.5, 3.5, 5.2, 3.8]));
    }
    
    for (let i = 0; i < 1; i++) {
        surveysDb.admin.push(generateBiasedRank([1.5, 2.5, 4.2, 3.8, 1.2, 5.8]));
    }
}

function generateBiasedRank(weights) {
    let indexed = weights.map((w, idx) => ({ idx, val: w + (Math.random() - 0.5) * 1.5 }));
    indexed.sort((a, b) => a.val - b.val); 
    
    let ranks = new Array(6);
    indexed.forEach((item, sortedIdx) => {
        ranks[item.idx] = sortedIdx + 1; 
    });
    return ranks;
}

seedDatabase();

let activeRole = 'student';
const roleButtons = document.querySelectorAll('.role-btn');
const surveyHeader = document.getElementById('survey-header');
const surveyDescText = document.getElementById('survey-desc-text');
const rankingQuestions = document.getElementById('ranking-questions');

const questions = {
    student: [
        'Оцените ясность критериев оценивания успеваемости (Целеполагание)',
        'Насколько важны междисциплинарные связи и системные методы (Методология)',
        'Качество и скорость реагирования администрации на ваши отзывы (Обратная связь)',
        'Оцените инфраструктуру вуза, LMS и доступность материалов (Ресурсное обеспечение)',
        'Уровень подготовки к рынку труда и наличие производственных практик (Внешняя среда)',
        'Удовлетворенность балансом учебной нагрузки и свободного времени (Личный комфорт)'
    ],
    teacher: [
        'Ясность стратегических KPI кафедры и стандартов ФГОС (Целеполагание)',
        'Возможности внедрения системных и междисциплинарных программ (Методология)',
        'Насколько быстро руководство реагирует на ваши инициативы (Обратная связь)',
        'Уровень материально-технического оснащения аудиторий и лабораторий (Ресурсы)',
        'Качество взаимодействия с работодателями и профильными ИТ-компаниями (Связи)',
        'Удовлетворенность балансом учебной нагрузки и научной работы (Удовлетворенность)'
    ],
    admin: [
        'Степень соответствия программ долгосрочным целям вуза (Целеполагание)',
        'Доля внедрения системных междисциплинарных курсов (Методология)',
        'Эффективность сбора обратной связи от студентов и ППС (Обратная связь)',
        'Финансирование новых лабораторий и инновационного оборудования (Ресурсы)',
        'Интеграция вуза в международные рейтинги и запросы рынка (Внешняя среда)',
        'Кадровый резерв, укомплектованность штата и удовлетворенность ППС (Кадры)'
    ]
};

roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        roleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeRole = btn.getAttribute('data-role');
        renderSurvey();
    });
});

function renderSurvey() {
    
    if (activeRole === 'student') {
        surveyHeader.innerText = 'Анкетирование студента: оценка системного обучения';
        surveyDescText.innerText = 'Оцените важность факторов эффективности учебного процесса для студента. Расставьте ранги от 1 (самый важный фактор) до 6 (наименее важный). Ранги не должны повторяться!';
    } else if (activeRole === 'teacher') {
        surveyHeader.innerText = 'Анкетирование преподавателя: методические и кадровые условия';
        surveyDescText.innerText = 'Оцените важность факторов для профессорско-преподавательского состава. Расставьте ранги от 1 (самый важный фактор) до 6 (наименее важный). Ранги не должны повторяться!';
    } else {
        surveyHeader.innerText = 'Анкетирование администратора: стратегическое управление';
        surveyDescText.innerText = 'Оцените важность факторов с точки зрения стратегического менеджмента и качества. Расставьте ранги от 1 (самый важный) до 6 (наименее важный). Ранги не должны повторяться!';
    }

    rankingQuestions.innerHTML = '';
    questions[activeRole].forEach((qText, idx) => {
        const item = document.createElement('div');
        item.className = 'rank-question-item';
        item.innerHTML = `
            <div class="question-text-side">
                <h4>${factors[idx].name}</h4>
                <p>${qText}</p>
            </div>
            <div class="rank-select-side">
                <label>Ранг:</label>
                <select class="rank-select" data-factor-idx="${idx}">
                    <option value="1" ${idx === 0 ? 'selected' : ''}>1 (Лучший)</option>
                    <option value="2" ${idx === 1 ? 'selected' : ''}>2</option>
                    <option value="3" ${idx === 2 ? 'selected' : ''}>3</option>
                    <option value="4" ${idx === 3 ? 'selected' : ''}>4</option>
                    <option value="5" ${idx === 4 ? 'selected' : ''}>5</option>
                    <option value="6" ${idx === 5 ? 'selected' : ''}>6 (Худший)</option>
                </select>
            </div>
        `;
        rankingQuestions.appendChild(item);
    });
}

renderSurvey();

const surveyForm = document.getElementById('expert-survey-form');
const surveyError = document.getElementById('survey-error');

surveyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selects = document.querySelectorAll('.rank-select');
    const selectedRanks = [];
    selects.forEach(select => {
        selectedRanks.push(parseInt(select.value));
    });

    const uniqueRanks = new Set(selectedRanks);
    if (uniqueRanks.size !== 6) {
        surveyError.style.display = 'flex';
        surveyError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    surveyError.style.display = 'none';
    surveysDb[activeRole].push(selectedRanks);

    alert('Благодарим вас! Ваша анкета эксперта успешно обработана и добавлена в общую базу данных исследования.');

    updateAnalytics();

    renderSurvey();
});

let radarChart = null;

function calculateAnalytics() {
    const totalStudents = surveysDb.student.length;
    const totalTeachers = surveysDb.teacher.length;
    const totalAdmins = surveysDb.admin.length;
    const m = totalStudents + totalTeachers + totalAdmins; 
    const n = 6; 

    let rankSums = [0, 0, 0, 0, 0, 0];
    let studentSums = [0, 0, 0, 0, 0, 0];
    let teacherSums = [0, 0, 0, 0, 0, 0];
    let adminSums = [0, 0, 0, 0, 0, 0];

    surveysDb.student.forEach(row => {
        row.forEach((rank, idx) => {
            rankSums[idx] += rank;
            studentSums[idx] += rank;
        });
    });

    surveysDb.teacher.forEach(row => {
        row.forEach((rank, idx) => {
            rankSums[idx] += rank;
            teacherSums[idx] += rank;
        });
    });

    surveysDb.admin.forEach(row => {
        row.forEach((rank, idx) => {
            rankSums[idx] += rank;
            adminSums[idx] += rank;
        });
    });

    const avgRanks = rankSums.map(sum => sum / m);
    const avgStudent = studentSums.map(sum => sum / totalStudents);
    const avgTeacher = teacherSums.map(sum => sum / totalTeachers);
    const avgAdmin = adminSums.map(sum => sum / totalAdmins);

    const rMean = m * (n + 1) / 2;
    let sValue = 0;
    rankSums.forEach(rj => {
        sValue += Math.pow(rj - rMean, 2);
    });

    const wValue = (12 * sValue) / (Math.pow(m, 2) * (Math.pow(n, 3) - n));

    const chiSquare = m * (n - 1) * wValue;
    
    return {
        m,
        n,
        rankSums,
        rMean,
        sValue,
        wValue,
        chiSquare,
        avgStudent,
        avgTeacher,
        avgAdmin,
        avgRanks
    };
}

function updateAnalytics() {
    const data = calculateAnalytics();

    document.getElementById('total-respondents-badge').innerText = data.m;
    document.getElementById('concordance-badge').innerText = data.wValue.toFixed(2);

    document.getElementById('math-s-val').innerText = data.sValue.toFixed(0);
    document.getElementById('math-w-val').innerText = data.wValue.toFixed(2);
    document.getElementById('math-chi-val').innerText = data.chiSquare.toFixed(2);

    const tbody = document.getElementById('concordance-table-body');
    tbody.innerHTML = '';
    
    factors.forEach((f, idx) => {
        const studentAvg = data.avgStudent[idx].toFixed(2);
        const teacherAvg = data.avgTeacher[idx].toFixed(2);
        const adminAvg = data.avgAdmin[idx].toFixed(2);
        const sumRanks = data.rankSums[idx];
        const deviation = sumRanks - data.rMean;
        const squaredDev = Math.pow(deviation, 2);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${f.name}</strong><br><small>${f.desc}</small></td>
            <td>${studentAvg}</td>
            <td>${teacherAvg}</td>
            <td>${adminAvg}</td>
            <td><strong>${sumRanks}</strong></td>
            <td>${deviation.toFixed(1)}</td>
            <td><strong>${squaredDev.toFixed(0)}</strong></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('avg-ranks-cell').innerText = data.rMean.toFixed(1);
    document.getElementById('sum-squared-cell').innerText = data.sValue.toFixed(0);

    const conclusion = document.getElementById('math-conclusion');
    let msg = '';
    if (data.chiSquare > 11.07) {
        msg = `<i class="fa-solid fa-circle-check" style="color: var(--accent-green)"></i> 
               <span><strong>Мнения экспертов согласованы!</strong> Коэффициент конкордации Кендалла W = <strong>${data.wValue.toFixed(2)}</strong>. 
               Статистический критерий проверки Пирсона <strong>χ² = ${data.chiSquare.toFixed(2)}</strong> превышает критическое значение <strong>11.07</strong>. 
               Нулевая гипотеза отвергается с надежностью 95%, согласие экспертов носит неслучайный характер.</span>`;
        conclusion.className = "conclusion-box";
        conclusion.style.borderColor = 'rgba(5, 243, 166, 0.2)';
        conclusion.style.background = 'rgba(5, 243, 166, 0.05)';
    } else {
        msg = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-red)"></i> 
               <span><strong>Слабое согласие!</strong> Коэффициент конкордации Кендалла W = <strong>${data.wValue.toFixed(2)}</strong>. 
               Статистический критерий проверки Пирсона <strong>χ² = ${data.chiSquare.toFixed(2)}</strong> ниже критического значения <strong>11.07</strong>. 
               Мнения экспертов разошлись, необходимо провести повторный тур анкетирования.</span>`;
        conclusion.className = "conclusion-box";
        conclusion.style.borderColor = 'rgba(255, 59, 105, 0.2)';
        conclusion.style.background = 'rgba(255, 59, 105, 0.05)';
    }
    conclusion.innerHTML = msg;

    const scoreStudent = data.avgStudent.map(r => 7 - r);
    const scoreTeacher = data.avgTeacher.map(r => 7 - r);
    const scoreAdmin = data.avgAdmin.map(r => 7 - r);

    const radarData = {
        labels: factors.map(f => f.id),
        datasets: [
            {
                label: 'Студенты',
                data: scoreStudent,
                fill: true,
                backgroundColor: 'rgba(0, 210, 255, 0.2)',
                borderColor: 'rgba(0, 210, 255, 1)',
                pointBackgroundColor: 'rgba(0, 210, 255, 1)',
                pointHoverBorderColor: 'rgba(0, 210, 255, 1)',
                borderWidth: 2
            },
            {
                label: 'Преподаватели',
                data: scoreTeacher,
                fill: true,
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: 'rgba(168, 85, 247, 1)',
                pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                pointHoverBorderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 2
            },
            {
                label: 'Администрация',
                data: scoreAdmin,
                fill: true,
                backgroundColor: 'rgba(5, 243, 166, 0.2)',
                borderColor: 'rgba(5, 243, 166, 1)',
                pointBackgroundColor: 'rgba(5, 243, 166, 1)',
                pointHoverBorderColor: 'rgba(5, 243, 166, 1)',
                borderWidth: 2
            }
        ]
    };

    if (radarChart) {
        radarChart.data = radarData;
        radarChart.update();
    } else {
        const ctx = document.getElementById('radarChart').getContext('2d');
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: radarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                        grid: { color: 'rgba(255, 255, 255, 0.08)' },
                        pointLabels: {
                            color: '#9ca3af',
                            font: { family: 'Outfit', size: 12, weight: 'bold' }
                        },
                        ticks: {
                            color: '#9ca3af',
                            backdropColor: 'transparent',
                            stepSize: 1
                        },
                        min: 0,
                        max: 6
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f3f4f6',
                            font: { family: 'Outfit', size: 12 }
                        }
                    }
                }
            }
        });
    }
}

const swotCells = document.querySelectorAll('.swot-cell');
const swotRecBox = document.getElementById('swot-recommendation');
const swotRecTitle = document.getElementById('swot-rec-title');
const swotRecText = document.getElementById('swot-rec-text');

const swotRecommendations = {
    s: {
        title: 'Стратегия использования Сильных сторон (S-O / S-T)',
        text: 'Используйте высокий научный потенциал преподавательского состава и современную LMS-среду для масштабирования проектного обучения. Привлекайте ведущих преподавателей к созданию сквозных научных лабораторий и междисциплинарных программ. Это позволит существенно увеличить рейтинг вуза и привлечь дополнительное грантовое финансирование.'
    },
    w: {
        title: 'Стратегия минимизации Слабых сторон (W-O / W-T)',
        text: 'Необходимо срочно снизить бюрократическую нагрузку на ППС путем автоматизации создания УМКД/РПД в LMS-системе. Внедрение автоматизированной пульс-аналитики мнений студентов позволит оперативно корректировать учебные планы до момента наступления кризисных явлений (отчисление, потеря мотивации).'
    },
    o: {
        title: 'Стратегия реализации Возможностей (O-S / O-W)',
        text: 'Углубляйте междисциплинарную интеграцию совместно с крупными ИТ-работодателями. Создайте базовые кафедры и совместные образовательные траектории, где результатом курсовой или дипломной работы является реальный коммерческий продукт, а не бумажный отчет. Это ликвидирует разрыв между теорией и практикой.'
    },
    t: {
        title: 'Стратегия защиты от Угроз (T-S / T-W)',
        text: 'Для защиты от профессионального выгорания ППС необходимо ввести жесткие регламенты максимальной еженедельной нагрузки и ограничить количество бумажных отчетов. Для борьбы с падением мотивации студентов следует активно внедрять геймификацию, интерактивные симуляторы и тренажеры в учебный процесс с 1-го курса.'
    }
};

swotCells.forEach(cell => {
    cell.addEventListener('click', () => {
        const key = cell.getAttribute('data-swot');
        const rec = swotRecommendations[key];
        
        swotRecTitle.innerText = rec.title;
        swotRecText.innerText = rec.text;

        if (key === 's') swotRecBox.style.borderLeftColor = 'var(--accent-green)';
        else if (key === 'w') swotRecBox.style.borderLeftColor = 'var(--accent-red)';
        else if (key === 'o') swotRecBox.style.borderLeftColor = 'var(--accent-blue)';
        else swotRecBox.style.borderLeftColor = 'var(--accent-orange)';
        
        swotRecBox.style.display = 'block';
        swotRecBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

let simulatorChart = null;

const sliderFin = document.getElementById('slider-fin');
const sliderMethods = document.getElementById('slider-methods');
const sliderWorkload = document.getElementById('slider-workload');
const sliderEngagement = document.getElementById('slider-engagement');

const valFin = document.getElementById('val-fin');
const valMethods = document.getElementById('val-methods');
const valWorkload = document.getElementById('val-workload');
const valEngagement = document.getElementById('val-engagement');

[sliderFin, sliderMethods, sliderWorkload, sliderEngagement].forEach(slider => {
    slider.addEventListener('input', () => {
        updateSliderLabels();
        runSimulation();
    });
});

function updateSliderLabels() {
    valFin.innerText = `${sliderFin.value}%`;
    valMethods.innerText = `${sliderMethods.value}%`;
    valWorkload.innerText = `${sliderWorkload.value}%`;
    valEngagement.innerText = `${sliderEngagement.value}%`;
}

function runSimulation() {
    const F = parseFloat(sliderFin.value) / 100.0;
    const M = parseFloat(sliderMethods.value) / 100.0;
    const L = parseFloat(sliderWorkload.value) / 100.0;
    const E = parseFloat(sliderEngagement.value) / 100.0;

    let time = ['0 год', '1 год', '2 год', '3 год', '4 год', '5 год'];

    let quality = [45];
    let sat = [50];
    let eff = [40];

    for (let t = 1; t <= 5; t++) {
        
        let targetQuality = (0.35 * F + 0.3 * M + 0.3 * E - 0.15 * L) * 100;
        targetQuality = Math.max(10, Math.min(100, targetQuality));

        let targetSat = (0.45 * F + 0.25 * M - 0.55 * L + 0.4) * 100;
        targetSat = Math.max(10, Math.min(100, targetSat));

        let targetEff = (0.55 * M + 0.35 * F - 0.15 * L + 0.2) * 100;
        targetEff = Math.max(10, Math.min(100, targetEff));

        let q_next = quality[t - 1] + 0.45 * (targetQuality - quality[t - 1]);
        let s_next = sat[t - 1] + 0.45 * (targetSat - sat[t - 1]);
        let e_next = eff[t - 1] + 0.45 * (targetEff - eff[t - 1]);

        quality.push(q_next);
        sat.push(s_next);
        eff.push(e_next);
    }

    const roundedQuality = quality.map(v => Math.round(v));
    const roundedSat = sat.map(v => Math.round(v));
    const roundedEff = eff.map(v => Math.round(v));

    updateSimulatorChart(time, roundedQuality, roundedSat, roundedEff);
}

function updateSimulatorChart(labels, quality, satisfaction, efficiency) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Качество образования (%)',
                data: quality,
                borderColor: 'rgba(0, 210, 255, 1)',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
                tension: 0.3,
                borderWidth: 3,
                pointRadius: 4
            },
            {
                label: 'Удовлетворенность ППС (%)',
                data: satisfaction,
                borderColor: 'rgba(255, 59, 105, 1)',
                backgroundColor: 'rgba(255, 59, 105, 0.1)',
                tension: 0.3,
                borderWidth: 3,
                pointRadius: 4
            },
            {
                label: 'Эффективность управления (%)',
                data: efficiency,
                borderColor: 'rgba(5, 243, 166, 1)',
                backgroundColor: 'rgba(5, 243, 166, 0.1)',
                tension: 0.3,
                borderWidth: 3,
                pointRadius: 4
            }
        ]
    };

    if (simulatorChart) {
        simulatorChart.data = chartData;
        simulatorChart.update('none'); 
    } else {
        const ctx = document.getElementById('simulatorChart').getContext('2d');
        simulatorChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#9ca3af', font: { family: 'Outfit' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#9ca3af', font: { family: 'Outfit' } },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f3f4f6',
                            font: { family: 'Outfit', size: 12 }
                        }
                    }
                }
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    updateAnalytics();
    updateSliderLabels();
    runSimulation();
});
