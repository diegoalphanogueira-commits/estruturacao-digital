/* =========================================================
   CONFIGURAÇÕES
========================================================= */

/*
Coloque aqui o WhatsApp que receberá os diagnósticos.

Formato:
55 + DDD + número

Exemplo:
5511999999999
*/

const WHATSAPP_NUMBER = "5511999999999";


/*
Se depois você tiver um Calendly ou outro link de agenda,
coloque aqui.

Exemplo:
const SCHEDULE_URL = "https://calendly.com/seulink";

Enquanto estiver vazio, o botão "Agendar reunião"
abre o WhatsApp.
*/

const SCHEDULE_URL = "";



/* =========================================================
   ESTADO DO QUIZ
========================================================= */

const TOTAL_STEPS = 7;

let currentStep = 1;


const answers = {

    segmento: "",

    aquisicao: "",

    estruturaDigital: "",

    estruturaAtual: [],

    gargalo: "",

    prazo: "",

    nome: "",

    empresa: "",

    telefone: ""

};



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setCurrentYear();

    setupMobileMenu();

    setupWhatsApp();

    setupScheduleButtons();

    setupPhoneMask();

    setupQuiz();

});



/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

function setCurrentYear() {

    const currentYear =
        document.getElementById("currentYear");


    if (!currentYear) {
        return;
    }


    currentYear.textContent =
        new Date().getFullYear();

}



/* =========================================================
   MENU MOBILE
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById("mobileMenuButton");


    const menu =
        document.getElementById("mobileMenu");


    if (!button || !menu) {
        return;
    }



    button.addEventListener("click", () => {

        const isOpen =
            menu.classList.contains("active");


        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    });



    menu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {

                closeMenu();

            });

        });



    window.addEventListener("resize", () => {

        if (window.innerWidth > 1050) {

            closeMenu();

        }

    });



    function openMenu() {

        menu.classList.add("active");

        document.body.classList.add("menu-open");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

    }



    function closeMenu() {

        menu.classList.remove("active");

        document.body.classList.remove("menu-open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}



/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {

    const floatingButton =
        document.getElementById("floatingWhatsapp");


    if (!floatingButton) {
        return;
    }


    const message = `
Olá Diego!

Vi seu site sobre Estruturação Digital e gostaria de entender melhor como funciona.
    `.trim();


    floatingButton.href =
        createWhatsAppURL(message);


    floatingButton.target =
        "_blank";


    floatingButton.rel =
        "noopener noreferrer";

}



/* =========================================================
   AGENDAMENTO
========================================================= */

function setupScheduleButtons() {

    const buttons =
        document.querySelectorAll(
            '[data-action="schedule"]'
        );


    buttons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();


            /*
            SE TIVER LINK DE AGENDA
            */

            if (SCHEDULE_URL) {

                window.open(
                    SCHEDULE_URL,
                    "_blank",
                    "noopener,noreferrer"
                );

                return;

            }


            /*
            ENQUANTO NÃO TIVER LINK,
            ABRE WHATSAPP
            */

            const message = `
Olá Diego!

Vi seu site sobre Estruturação Digital e gostaria de agendar uma conversa sobre minha empresa.
            `.trim();


            window.open(
                createWhatsAppURL(message),
                "_blank"
            );

        });

    });

}



/* =========================================================
   MÁSCARA WHATSAPP
========================================================= */

function setupPhoneMask() {

    const phone =
        document.getElementById("quizPhone");


    if (!phone) {
        return;
    }



    phone.addEventListener("input", (event) => {

        let value =
            event.target.value.replace(/\D/g, "");


        value =
            value.substring(0, 11);



        if (value.length > 0) {

            value =
                "(" + value;

        }


        if (value.length > 3) {

            value =
                value.slice(0, 3) +
                ") " +
                value.slice(3);

        }


        if (value.length > 10) {

            value =
                value.slice(0, 10) +
                "-" +
                value.slice(10);

        }


        event.target.value =
            value;

    });

}



/* =========================================================
   QUIZ
========================================================= */

function setupQuiz() {

    const quiz =
        document.getElementById(
            "diagnosticQuiz"
        );


    if (!quiz) {
        return;
    }



    const options =
        quiz.querySelectorAll(
            ".quiz-option"
        );


    const nextButton =
        quiz.querySelector(
            "[data-next]"
        );


    const backButton =
        document.getElementById(
            "quizBack"
        );


    const finishButton =
        document.getElementById(
            "finishQuiz"
        );



    /*
    COMEÇA NO PASSO 1
    */

    showStep(1);



    /* =====================================================
       OPÇÕES
    ====================================================== */

    options.forEach((option) => {

        option.addEventListener("click", () => {

            const step =
                option.closest(".quiz-step");


            if (!step) {
                return;
            }


            const stepNumber =
                Number(step.dataset.step);


            const value =
                option.dataset.value;



            /*
            PASSO 4 =
            MÚLTIPLA ESCOLHA
            */

            if (
                option.classList.contains(
                    "quiz-option-multiple"
                )
            ) {

                handleMultipleOption(
                    option,
                    value
                );


                updateMultipleButton();

                return;

            }



            /*
            DEMAIS PASSOS =
            ESCOLHA ÚNICA
            */

            step
                .querySelectorAll(
                    ".quiz-option"
                )
                .forEach((item) => {

                    item.classList.remove(
                        "selected"
                    );

                });


            option.classList.add(
                "selected"
            );


            saveSingleAnswer(
                stepNumber,
                value
            );


            /*
            PEQUENO DELAY
            PARA A PESSOA PERCEBER
            A SELEÇÃO
            */

            setTimeout(() => {

                if (stepNumber < 7) {

                    showStep(
                        stepNumber + 1
                    );

                }

            }, 180);

        });

    });



    /* =====================================================
       BOTÃO CONTINUAR DA MÚLTIPLA ESCOLHA
    ====================================================== */

    if (nextButton) {

        nextButton.disabled = true;


        nextButton.addEventListener(
            "click",
            () => {

                if (
                    answers
                        .estruturaAtual
                        .length === 0
                ) {

                    return;

                }


                showStep(5);

            }
        );

    }



    /* =====================================================
       VOLTAR
    ====================================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                if (currentStep <= 1) {
                    return;
                }


                showStep(
                    currentStep - 1
                );

            }
        );

    }



    /* =====================================================
       FINALIZAR
    ====================================================== */

    if (finishButton) {

        finishButton.addEventListener(
            "click",
            finishQuiz
        );

    }

}



/* =========================================================
   SALVAR RESPOSTA ÚNICA
========================================================= */

function saveSingleAnswer(
    step,
    value
) {

    switch (step) {

        case 1:

            answers.segmento =
                value;

            break;


        case 2:

            answers.aquisicao =
                value;

            break;


        case 3:

            answers.estruturaDigital =
                value;

            break;


        case 5:

            answers.gargalo =
                value;

            break;


        case 6:

            answers.prazo =
                value;

            break;

    }

}



/* =========================================================
   MÚLTIPLA ESCOLHA
========================================================= */

function handleMultipleOption(
    option,
    value
) {

    const noStructure =
        "Nenhuma estrutura completa";


    /*
    CASO SELECIONE:
    NENHUMA ESTRUTURA
    */

    if (value === noStructure) {

        document
            .querySelectorAll(
                ".quiz-option-multiple"
            )
            .forEach((item) => {

                item.classList.remove(
                    "selected"
                );

            });


        option.classList.add(
            "selected"
        );


        answers.estruturaAtual =
            [noStructure];


        return;

    }



    /*
    SE SELECIONAR OUTRA OPÇÃO,
    REMOVE "NENHUMA"
    */

    document
        .querySelectorAll(
            ".quiz-option-multiple"
        )
        .forEach((item) => {

            if (
                item.dataset.value ===
                noStructure
            ) {

                item.classList.remove(
                    "selected"
                );

            }

        });



    answers.estruturaAtual =
        answers
            .estruturaAtual
            .filter(
                item =>
                    item !== noStructure
            );



    /*
    LIGA / DESLIGA OPÇÃO
    */

    const isSelected =
        option.classList.contains(
            "selected"
        );


    if (isSelected) {

        option.classList.remove(
            "selected"
        );


        answers.estruturaAtual =
            answers
                .estruturaAtual
                .filter(
                    item =>
                        item !== value
                );

    } else {

        option.classList.add(
            "selected"
        );


        answers.estruturaAtual.push(
            value
        );

    }

}



/* =========================================================
   BOTÃO DO PASSO 4
========================================================= */

function updateMultipleButton() {

    const button =
        document.querySelector(
            "[data-next]"
        );


    if (!button) {
        return;
    }


    button.disabled =
        answers
            .estruturaAtual
            .length === 0;

}



/* =========================================================
   EXIBIR PASSO
========================================================= */

function showStep(stepNumber) {

    const steps =
        document.querySelectorAll(
            ".quiz-step"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    const backButton =
        document.getElementById(
            "quizBack"
        );


    /*
    ESCONDE RESULTADO
    */

    if (result) {

        result.hidden = true;

    }



    /*
    ESCONDE TODOS
    */

    steps.forEach((step) => {

        step.hidden = true;

        step.classList.remove(
            "active"
        );

    });



    /*
    EXIBE PASSO
    */

    const activeStep =
        document.querySelector(
            `.quiz-step[data-step="${stepNumber}"]`
        );


    if (!activeStep) {
        return;
    }


    activeStep.hidden = false;

    activeStep.classList.add(
        "active"
    );


    currentStep =
        stepNumber;



    /*
    VOLTAR
    */

    if (backButton) {

        backButton.hidden =
            stepNumber === 1;

    }



    updateProgress();

}



/* =========================================================
   PROGRESSO
========================================================= */

function updateProgress() {

    const text =
        document.getElementById(
            "quizStepText"
        );


    const percentage =
        document.getElementById(
            "quizPercentage"
        );


    const bar =
        document.getElementById(
            "quizProgressBar"
        );


    const value =
        Math.round(
            (
                currentStep /
                TOTAL_STEPS
            ) * 100
        );



    if (text) {

        text.textContent =
            `Pergunta ${currentStep} de ${TOTAL_STEPS}`;

    }


    if (percentage) {

        percentage.textContent =
            `${value}%`;

    }


    if (bar) {

        bar.style.width =
            `${value}%`;

    }

}



/* =========================================================
   FINALIZAR QUIZ
========================================================= */

function finishQuiz() {

    const name =
        document
            .getElementById(
                "quizName"
            )
            ?.value
            .trim();


    const company =
        document
            .getElementById(
                "quizCompany"
            )
            ?.value
            .trim();


    const phone =
        document
            .getElementById(
                "quizPhone"
            )
            ?.value
            .trim();


    const consent =
        document
            .getElementById(
                "quizConsent"
            )
            ?.checked;



    /*
    VALIDAÇÃO
    */

    if (!name) {

        showFieldError(
            "quizName"
        );

        return;

    }


    if (!company) {

        showFieldError(
            "quizCompany"
        );

        return;

    }


    if (!phone) {

        showFieldError(
            "quizPhone"
        );

        return;

    }


    if (!consent) {

        alert(
            "Para finalizar o diagnóstico, autorize o contato."
        );

        return;

    }



    answers.nome =
        name;


    answers.empresa =
        company;


    answers.telefone =
        phone;



    /*
    CALCULA PRIORIDADES
    */

    const priorities =
        calculatePriorities();



    /*
    EXIBE RESULTADO
    */

    showResult(
        priorities
    );



    /*
    PREPARA WHATSAPP
    */

    prepareResultWhatsApp(
        priorities
    );



    /*
    EVENTO PERSONALIZADO
    PARA META PIXEL / GTM / API FUTURA
    */

    window.dispatchEvent(

        new CustomEvent(
            "diagnosticCompleted",
            {

                detail: {

                    ...answers,

                    priorities

                }

            }
        )

    );

}



/* =========================================================
   ERRO DE CAMPO
========================================================= */

function showFieldError(id) {

    const field =
        document.getElementById(id);


    if (!field) {
        return;
    }


    field.focus();


    field.style.borderColor =
        "#d94c4c";


    field.style.boxShadow =
        "0 0 0 4px rgba(217,76,76,.08)";


    setTimeout(() => {

        field.style.borderColor = "";

        field.style.boxShadow = "";

    }, 1800);

}



/* =========================================================
   CÁLCULO DAS PRIORIDADES
========================================================= */

function calculatePriorities() {

    const scores = {

        posicionamento: 0,

        aquisicao: 0,

        comercial: 0,

        tecnologia: 0

    };



    /* =====================================================
       PRESENÇA DIGITAL
    ====================================================== */

    switch (
        answers.estruturaDigital
    ) {

        case "Muito fraca":

            scores.posicionamento += 5;

            break;


        case "Básica":

            scores.posicionamento += 4;

            break;


        case "Razoável":

            scores.posicionamento += 2;

            break;


        case "Boa":

            scores.posicionamento += 1;

            break;

    }



    /* =====================================================
       AQUISIÇÃO
    ====================================================== */

    switch (
        answers.aquisicao
    ) {

        case "Indicação":

            scores.aquisicao += 4;

            scores.posicionamento += 1;

            break;


        case "Google":

            scores.posicionamento += 2;

            scores.aquisicao += 1;

            break;


        case "Instagram / Redes sociais":

            scores.posicionamento += 1;

            scores.aquisicao += 2;

            break;


        case "Tráfego pago":

            scores.aquisicao += 1;

            scores.comercial += 1;

            break;


        case "Prospecção":

            scores.aquisicao += 2;

            scores.comercial += 1;

            break;


        case "Não temos um canal previsível":

            scores.aquisicao += 5;

            break;

    }



    /* =====================================================
       ESTRUTURA EXISTENTE
    ====================================================== */

    const structure =
        answers.estruturaAtual;



    if (
        structure.includes(
            "Nenhuma estrutura completa"
        )
    ) {

        scores.posicionamento += 4;

        scores.aquisicao += 3;

        scores.comercial += 3;

        scores.tecnologia += 3;

    } else {

        if (
            !structure.includes(
                "Google Perfil da Empresa"
            )
        ) {

            scores.posicionamento += 2;

        }


        if (
            !structure.includes(
                "Site profissional"
            )
        ) {

            scores.posicionamento += 2;

        }


        if (
            !structure.includes(
                "Avaliações no Google"
            )
        ) {

            scores.posicionamento += 2;

        }


        if (
            !structure.includes(
                "Processo comercial"
            )
        ) {

            scores.comercial += 3;

        }


        if (
            !structure.includes(
                "CRM"
            )
        ) {

            scores.comercial += 1;

            scores.tecnologia += 2;

        }


        if (
            !structure.includes(
                "Automações"
            )
        ) {

            scores.tecnologia += 2;

        }

    }



    /* =====================================================
       PRINCIPAL GARGALO
    ====================================================== */

    switch (
        answers.gargalo
    ) {

        case "Ser encontrado":

            scores.posicionamento += 5;

            break;


        case "Gerar oportunidades":

            scores.aquisicao += 5;

            break;


        case "Melhorar atendimento":

            scores.comercial += 4;

            scores.tecnologia += 2;

            break;


        case "Organizar comercial":

            scores.comercial += 5;

            break;


        case "Automação e IA":

            scores.tecnologia += 5;

            break;


        case "Estruturar tudo":

            scores.posicionamento += 3;

            scores.aquisicao += 3;

            scores.comercial += 3;

            scores.tecnologia += 3;

            break;

    }



    /*
    ORDENA DO MAIOR PARA O MENOR
    */

    const ordered =
        Object
            .entries(scores)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );



    /*
    PEGA AS 3 PRINCIPAIS
    */

    return ordered
        .slice(0, 3)
        .map(([key, score]) => ({

            key,

            score,

            label:
                getPriorityLabel(key)

        }));

}



/* =========================================================
   NOMES DAS PRIORIDADES
========================================================= */

function getPriorityLabel(key) {

    const labels = {

        posicionamento:
            "Posicionamento Digital",

        aquisicao:
            "Aquisição de Clientes",

        comercial:
            "Estrutura Comercial",

        tecnologia:
            "Tecnologia e Automação"

    };


    return labels[key] || key;

}



/* =========================================================
   RESULTADO
========================================================= */

function showResult(priorities) {

    const steps =
        document.querySelectorAll(
            ".quiz-step"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    const prioritiesContainer =
        document.getElementById(
            "resultPriorities"
        );


    const back =
        document.getElementById(
            "quizBack"
        );


    steps.forEach((step) => {

        step.hidden = true;

    });



    if (back) {

        back.hidden = true;

    }



    if (
        prioritiesContainer
    ) {

        prioritiesContainer.innerHTML =
            "";


        priorities.forEach(
            (priority) => {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.textContent =
                    priority.label;


                prioritiesContainer
                    .appendChild(tag);

            }
        );

    }



    if (result) {

        result.hidden = false;

    }



    const text =
        document.getElementById(
            "quizStepText"
        );


    const percentage =
        document.getElementById(
            "quizPercentage"
        );


    const bar =
        document.getElementById(
            "quizProgressBar"
        );


    if (text) {

        text.textContent =
            "Diagnóstico concluído";

    }


    if (percentage) {

        percentage.textContent =
            "100%";

    }


    if (bar) {

        bar.style.width =
            "100%";

    }

}



/* =========================================================
   WHATSAPP DO RESULTADO
========================================================= */

function prepareResultWhatsApp(
    priorities
) {

    const button =
        document.getElementById(
            "resultWhatsapp"
        );


    if (!button) {
        return;
    }



    const priorityText =
        priorities
            .map(
                (item, index) =>
                    `${index + 1}. ${item.label}`
            )
            .join("\n");



    const structureText =
        answers
            .estruturaAtual
            .join(", ");



    const message = `
Olá Diego!

Acabei de concluir o Diagnóstico de Estruturação Digital pelo site.

*EMPRESA*

Nome: ${answers.nome}
Empresa: ${answers.empresa}
WhatsApp: ${answers.telefone}
Segmento: ${answers.segmento}


*CENÁRIO ATUAL*

Principal origem dos clientes:
${answers.aquisicao}

Como avalio nossa estrutura digital:
${answers.estruturaDigital}

O que já possuímos:
${structureText}

Principal desafio:
${answers.gargalo}

Quando queremos começar:
${answers.prazo}


*PRIORIDADES IDENTIFICADAS*

${priorityText}


Gostaria de entender melhor essa análise e os próximos passos para estruturar minha empresa.
    `.trim();



    button.href =
        createWhatsAppURL(
            message
        );


    button.target =
        "_blank";


    button.rel =
        "noopener noreferrer";

}



/* =========================================================
   GERAR URL DO WHATSAPP
========================================================= */

function createWhatsAppURL(
    message
) {

    const encoded =
        encodeURIComponent(
            message
        );


    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encoded
    );

}
