interface ITokens {
  refreshToken: string,
  accessToken: string
}

export interface IAuthResponse {
  message: string,
  data: ITokens,
  error?: string[]
}