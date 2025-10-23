import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    onModuleInit() {
        if (!admin.apps.length) {
            const serviceAccount = {
                type: process.env.GOOGLE_TYPE,
                project_id: process.env.GOOGLE_PROJECT_ID,
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                auth_uri: process.env.GOOGLE_AUTH_URI,
                token_uri: process.env.GOOGLE_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
                client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
                universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
            };
            admin.initializeApp({
                credential: admin.credential.cert(
                    serviceAccount as admin.ServiceAccount
                ),
            });
        }
    }
    async verifyToken(token: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken.uid;
        } catch (e) {
            console.error('Token verification failed:', e);
            return undefined
        }
    }
}