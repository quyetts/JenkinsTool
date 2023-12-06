import firebase from "firebase";
import initFirebase from "../../../firebase/initFirebase";

export default async function handler(req, res) {
		try {
			initFirebase();
			const snapshot = await firebase.firestore().collection('ipCollection').get();

			let userIPs = [];
			snapshot.forEach(doc => {
				userIPs.push(doc.data().ip);
			});

			let ipList = '';
			userIPs.forEach(ip => {
				ipList += `|${ip}`
			});

			const str = `<Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127\\.\\d+\\.\\d+\\.\\d+|::1|0:0:0:0:0:0:0:1|116.110.111.*|116.110.209.235|27.69.251.161|113.176.99.*|116.105.225.*|118.69.73.*|192.168.79.*|192.168.76.*|192.168.78.*|192.168.63.*|192.168.65.*|192.168.71.*|34.74.90.*|34.74.226.*|116.110.6.*|116.98.166.*${ipList}" />`;

			res.status(200).json(str);
		} catch (err) {
			console.log(req);
			res.status(500).json({ statusCode: 500, message: err.message });
		}
}
