import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [
        inferAdditionalFields({
            user: {
                additionalFields: {
                    photoUrl:   { type: "string", required: false },
                    role:       { type: "string", required: false },
                    status:     { type: "string", required: false },
                    bloodGroup: { type: "string", required: false },
                    district:   { type: "string", required: false },
                    upazila:    { type: "string", required: false },
                }
            },
            session: {
        additionalFields: {          
            role:   { type: "string" },
            status: { type: "string" },
        }
    },
        })
        
    ]
});

export const { signIn, signUp, useSession } = authClient;