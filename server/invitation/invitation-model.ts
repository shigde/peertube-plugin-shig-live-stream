interface InvitationModel {
    id: number
    type: number
    isRead: boolean
    userId:number
    accountId: number
    videoId: number
    videoUrl: string
    videoName: string
    createdAt: Date
    updatedAt: Date
}

export type {
    InvitationModel
}
