exports.validateInput = async (qrText, req, res) => {
    try {
        if (!qrText || typeof qrText !== 'string' || qrText.trim() === '') {
            return res.status(400).json({ error: 'Invalid or empty QR text' });
        }

    } catch (error) {
        console.log(error)

    }
}