/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */

/*
IMPORTANTE:

Troque o número abaixo pelo SEU WhatsApp.

Formato:
55 + DDD + número

Exemplo:
5511999999999

Não coloque:
+
espaços
parênteses
traços
*/

const WHATSAPP_NUMBER = "5511999999999";



/* =========================================================
   QUANDO A PÁGINA CARREGAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setCurrentYear();

    setupMobileMenu();

    setupFAQ();

    setupPhoneMask();

    setupFloatingWhatsApp();

    setupLeadForm();

});



/* =========================================================
   ANO AUTOMÁTICO NO FOOTER
========================================================= */

function setCurrentYear() {

    const currentYearElement =
        document.getElementById("currentYear");


    if (!currentYearElement) {
        return;
    }


    const currentYear =
        new Date().getFullYear();


    currentYearElement.textContent =
        currentYear;

}



/* =========================================================
   MENU MOBILE
========================================================= */

function setupMobileMenu() {

    const menuButton =
        document.getElementById("mobileMenuButton");


    const mobileMenu =
        document.getElementById("mobileMenu");


    if (!menuButton || !mobileMenu) {
        return;
    }



    /*
    ABRIR / FECHAR MENU
    */

    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.contains("active");


        if (isOpen) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    });



    /*
    FECHAR AO CLICAR EM ALGUM LINK
    */

    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {

            closeMobileMenu();

        });

    });



    /*
    FECHAR CASO O USUÁRIO AUMENTE A TELA
    */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 1000) {

            closeMobileMenu();

        }

    });



    function openMobileMenu() {

        mobileMenu.classList.add("active");

        document.body.classList.add("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }



    function closeMobileMenu() {

        mobileMenu.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}



/* =========================================================
   FAQ
========================================================= */

function setupFAQ() {

    const faqItems =
        document.querySelectorAll(".faq-item");


    if (!faqItems.length) {
        return;
    }



    faqItems.forEach((item) => {

        const question =
            item.querySelector(".faq-question");


        const answer =
            item.querySelector(".faq-answer");


        if (!question || !answer) {
            return;
        }



        question.addEventListener("click", () => {

            const isActive =
                item.classList.contains("active");



            /*
            FECHA TODOS OS OUTROS
            */

            faqItems.forEach((otherItem) => {

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");


                otherItem.classList.remove("active");


                if (otherAnswer) {

                    otherAnswer.style.maxHeight = null;

                }

            });



            /*
            SE ESTAVA FECHADO,
            ABRE O ITEM CLICADO
            */

            if (!isActive) {

                item.classList.add("active");


                answer.style.maxHeight =
                    answer.scrollHeight + "px";

            }

        });

    });

}



/* =========================================================
   MÁSCARA DO WHATSAPP
========================================================= */

function setupPhoneMask() {

    const phoneInput =
        document.getElementById("telefone");


    if (!phoneInput) {
        return;
    }



    phoneInput.addEventListener("input", (event) => {

        let value =
            event.target.value.replace(/\D/g, "");



        /*
        LIMITA EM 11 NÚMEROS
        */

        value =
            value.substring(0, 11);



        /*
        FORMATAÇÃO
        (11) 99999-9999
        */

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
   WHATSAPP FLUTUANTE
========================================================= */

function setupFloatingWhatsApp() {

    const whatsappButton =
        document.getElementById("floatingWhatsapp");


    if (!whatsappButton) {
        return;
    }



    const message =
        "Olá Diego! Vi seu site de Estruturação Digital e gostaria de entender melhor como funciona.";



    const whatsappURL =
        createWhatsAppURL(message);



    whatsappButton.href =
        whatsappURL;


    whatsappButton.target =
        "_blank";


    whatsappButton.rel =
        "noopener noreferrer";

}



/* =========================================================
   FORMULÁRIO DE DIAGNÓSTICO
========================================================= */

function setupLeadForm() {

    const form =
        document.getElementById("leadForm");


    if (!form) {
        return;
    }



    form.addEventListener("submit", (event) => {

        event.preventDefault();



        /*
        VALIDAÇÃO NATIVA DO HTML
        */

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }



        /*
        CAPTURA OS DADOS
        */

        const formData =
            new FormData(form);



        const nome =
            formData.get("nome") || "";


        const telefone =
            formData.get("telefone") || "";


        const empresa =
            formData.get("empresa") || "";


        const segmento =
            formData.get("segmento") || "";


        const cidade =
            formData.get("cidade") || "";


        const desafio =
            getSelectedText(
                "desafio"
            );


        const aquisicao =
            getSelectedText(
                "aquisicao"
            );


        const site =
            getSelectedText(
                "site"
            );


        const crm =
            getSelectedText(
                "crm"
            );


        const prazo =
            getSelectedText(
                "prazo"
            );



        /*
        MONTA A MENSAGEM
        */

        const message = `
Olá Diego!

Acabei de preencher o diagnóstico de Estruturação Digital pelo site.

*DADOS DA EMPRESA*

Nome: ${nome}

WhatsApp: ${telefone}

Empresa: ${empresa}

Segmento: ${segmento}

Cidade / Região: ${cidade}


*DIAGNÓSTICO INICIAL*

Principal desafio:
${desafio}

Como chegam mais clientes hoje:
${aquisicao}

Possui site:
${site}

Utiliza CRM:
${crm}

Quando gostaria de começar:
${prazo}


Gostaria de entender quais seriam os próximos passos para estruturar melhor minha empresa no digital.
        `.trim();



        /*
        CRIA URL
        */

        const whatsappURL =
            createWhatsAppURL(message);



        /*
        EVENTO PERSONALIZADO
        ÚTIL PARA META PIXEL / GOOGLE TAG MANAGER
        DEPOIS
        */

        window.dispatchEvent(
            new CustomEvent(
                "diagnosticSubmitted",
                {
                    detail: {
                        nome,
                        telefone,
                        empresa,
                        segmento,
                        cidade,
                        desafio,
                        aquisicao,
                        site,
                        crm,
                        prazo
                    }
                }
            )
        );



        /*
        ABRE O WHATSAPP
        */

        window.open(
            whatsappURL,
            "_blank"
        );

    });

}



/* =========================================================
   PEGAR TEXTO DO SELECT
========================================================= */

function getSelectedText(elementId) {

    const select =
        document.getElementById(elementId);


    if (!select) {
        return "";
    }



    const selectedOption =
        select.options[
            select.selectedIndex
        ];


    if (!selectedOption) {
        return "";
    }


    return selectedOption.text;

}



/* =========================================================
   GERAR LINK DO WHATSAPP
========================================================= */

function createWhatsAppURL(message) {

    const encodedMessage =
        encodeURIComponent(message);


    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodedMessage
    );

}
