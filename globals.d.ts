declare module "*.png"
declare module "*.jpg"
declare module "*.mp3"
declare module "*.wav"


export type BaseMail = {
    forceOpen: any;
    title: string,
    description: string,
    type: number
    read?: boolean,
    identifier: string
}

// results type partial of mailtyp + score and reason
export type ResultsMail<MailType> = MailType & {
    score: number,
    reason: number
}
