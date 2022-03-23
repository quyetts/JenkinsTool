const SECRET_SIGN_KEY = process.env.SECRET_SIGN_KEY;
import {createHmac} from 'crypto';

export default async function handler(req, res) {
		try {
			const { json } = req.body;

			const hmac = await createHmac('sha256', SECRET_SIGN_KEY);

			const preHash = `${json.purchaseID}.${json.originalTransactionID}.${json.refundTransactionID}`

			await hmac.update(preHash);

			const hashed = hmac.digest('base64');

			hmac.end();

			res.status(200).json({
				hashed: hashed
			});
		} catch (err) {
			console.log(req);
			res.status(500).json({ statusCode: 500, message: err.message });
		}
}
