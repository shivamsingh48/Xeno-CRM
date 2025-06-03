import {google} from 'googleapis'

export const oauth2client=new google.auth.OAuth2(
    process.env.GOOGLE_CILENT_ID,
    process.env.GOOGLE_CILENT_SECRET,
    'postmessage'
)