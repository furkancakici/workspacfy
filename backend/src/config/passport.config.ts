import { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { APP_CONFIG } from '@/config/app.config';

import { ProviderEnum } from '@/enums/account-provider.enum';

import { loginOrCreateAccountService } from '@/services/auth.service';

import { NotFoundException } from '@/utils/app-error';

passport.use(
    new GoogleStrategy(
        {
            clientID: APP_CONFIG.GOOGLE_CLIENT_ID,
            clientSecret: APP_CONFIG.GOOGLE_CLIENT_SECRET,
            callbackURL: APP_CONFIG.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;

                if (!googleId) {
                    throw new NotFoundException('Google ID not found');
                }
                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture,
                    email,
                });
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);
