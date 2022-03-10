
const S3 = require("react-aws-s3");

export class AWSUtils {

    constructor() {
        this.uploadFileAttachment = this.uploadFileAttachment.bind(this);
    }
    async uploadFileAttachment(file: File, fileName: string) {

        const config = {
            bucketName: process.env.REACT_APP_BUCKET_NAME,
            region: process.env.REACT_APP_REGION,
            accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        };
        try {
            const s3Client = new S3(config);
            const res = await s3Client.uploadFile(file, fileName);
            console.log(res);
            return res.location;
        } catch (error) {
            console.log(error);
        }
    };
}
