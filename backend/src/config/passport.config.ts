import { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { APP_CONFIG } from '@/config/app.config';

import UserModel from '@/models/user.model';

import { ProviderEnum } from '@/enums/account-provider.enum';

import { loginOrCreateAccountService } from '@/services/auth.service';

import { NotFoundException } from '@/utils/app-error';

passport.use(
    new GoogleStrategy(
        {
            clientID: APP_CONFIG.GOOGLE_CLIENT_ID,
            clientSecret: APP_CONFIG.GOOGLE_CLIENT_SECRET,
            callbackURL: APP_CONFIG.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                console.log('profile', profile);
                console.log('googleId', googleId);
                if (!googleId) {
                    throw new NotFoundException('Google ID (sub) is missing');
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

// Bu kısımları ekleyin
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        // User model'inizi import etmeniz gerekebilir
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
