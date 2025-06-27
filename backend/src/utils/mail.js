import Mailgen from "mailgen";

export const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
        // Appears in header & footer of e-mails
        name: 'Veritas',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});

// const email = {
//     body: {
//         name: 'John Appleseed',
//         intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
//         action: {
//             instructions: 'To get started with Mailgen, please click here:',
//             button: {
//                 color: '#22BC66', // Optional action button color
//                 text: 'Confirm your account',
//                 link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
//             }
//         },
//         outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//     }
// };

export const verifyEmail = (option) => {
    const email = {
        body: {
            name: option.name,
            intro: 'Welcome to Veritas! We\'re very excited to have you on board.',
            action: {
                instructions: option.subject,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: option.link
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    return email;
};

export const resetPasswordEmail = (option) => {
    const email = {
        body: {
            name: option.name,
            intro: 'Welcome to Viretas! We\'re very excited to have you on board.',
            action: {
                instructions: option.subject,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset your password',
                    link: option.link
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    return email;
};

// // Generate an HTML email with the provided contents
// export const emailBody = mailGenerator.generate(email);

// // Generate the plaintext version of the e-mail (for clients that do not support HTML)
// export const emailText = mailGenerator.generatePlaintext(email);