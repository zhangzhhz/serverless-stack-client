export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "ap-northeast-1",
    BUCKET: "notes-app-uploads-zhce19"
  },
  apiGateway: {
    REGION: "ap-northeast-1",
    URL: "https://ty0j06aylh.execute-api.ap-northeast-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "ap-northeast-1",
    USER_POOL_ID: "ap-northeast-1_Xu0VwRjZR",
    APP_CLIENT_ID: "2ocmci1hlnoje5sv777mnrfb4f",
    IDENTITY_POOL_ID: "ap-northeast-1:0eef3a29-197e-46a5-802f-d3fe1f2d4282"
  }
};