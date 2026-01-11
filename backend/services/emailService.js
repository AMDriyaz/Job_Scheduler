class EmailService {
    /**
     * Simulates sending an email
     * @param {string} to 
     * @param {string} subject 
     * @param {string} body 
     */
    static async sendEmail(to, subject, body) {
        console.log(`\n--- [EmailService] Sending Email ---`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log(`------------------------------------\n`);
        return true;
    }
}

module.exports = EmailService;
